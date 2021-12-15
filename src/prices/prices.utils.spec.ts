import { DataMapper } from '@aws/dynamodb-data-mapper';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { setupMapper } from '../test/tests.utils';
import { TokenType } from '../tokens/enums/token-type.enum';
import { Token } from '../tokens/interfaces/token.interface';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { getToken, protocolTokens } from '../tokens/tokens.utils';
import {
  getContractPrice,
  getPrice,
  getPriceData,
  getTokenPrice,
  getVaultTokenPrice,
  inCurrency,
  noPrice,
  updatePrice,
} from './prices.utils';
import * as requestUtils from '../etherscan/etherscan.utils';

describe('prices.utils', () => {
  const strategy = new TestStrategy();

  describe('getPrice', () => {
    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        const cake = getToken(TOKENS.CAKE);
        setupMapper([]);
        const cakePrice = await getPrice(cake.address);
        expect(cakePrice).toBeDefined();
        const expected = noPrice(cake);
        expect(cakePrice).toMatchObject({
          ...expected,
          updatedAt: expect.any(Number),
        });
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        const price = {
          ...(await strategy.getPrice(TOKENS.BADGER)),
          updateAt: Date.now(),
        };
        setupMapper([price]);
        const fetchedBadgerPrice = await getPrice(TOKENS.BADGER);
        expect(fetchedBadgerPrice).toBeDefined();
        expect(fetchedBadgerPrice).toMatchObject(price);
      });
    });
  });

  describe('updatePrice', () => {
    describe('update unsupported token', () => {
      it('throws an bad request error', async () => {
        const unsupportedToken: Token = {
          name: 'Fake Token',
          symbol: 'FTK',
          address: '0xfA5047c9c78B8877af97BDcb85Db743fD7313d4a',
          decimals: 18,
          type: TokenType.Contract,
        };
        await expect(updatePrice(unsupportedToken)).rejects.toThrow(NotFound);
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const badger = getToken(TOKENS.BADGER);
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await updatePrice(badger);
        expect(put.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('getPriceData', () => {
    it('gets all token pricing for the system', async () => {
      const query = setupMapper([]);
      const data = await getPriceData(protocolTokens);
      expect(query.mock.calls.length).toEqual(Object.keys(data).length);
      const requests = [];
      /* eslint-disable @typescript-eslint/no-explicit-any */
      for (const call of query.mock.calls as Iterable<any>) {
        expect(call[1]).toBeDefined();
        const { address } = call[1];
        expect(address).toBeDefined();
        requests.push(address);
      }
      /* eslint-enable @typescript-eslint/no-explicit-any */
      expect(requests).toMatchObject(Object.keys(protocolTokens));
    });
  });

  describe('getContractPrice', () => {
    it('Fetches the contract price in USD and ETH', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const usdPrice = Math.random() * 100;
      const etherPrice = usdPrice / 1500;
      const mockResponse = {
        '0x3472a5a71965499acd81997a54bba8d852c6e53d': {
          usd: usdPrice,
          eth: etherPrice,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getContractPrice(contract);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: contract,
        usd: usdPrice,
        eth: etherPrice,
      });
    });
  });

  describe('getTokenPrice', () => {
    it('Fetches the token price in USD and ETH', async () => {
      const token = 'Badger';
      const usdPrice = Math.random() * 100;
      const etherPrice = usdPrice / 1500;
      const mockResponse = {
        Badger: {
          usd: usdPrice,
          eth: etherPrice,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getTokenPrice(token);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        name: token,
        usd: usdPrice,
        eth: etherPrice,
      });
    });
  });

  describe('inCurrency', () => {
    const priceData: TokenPrice = {
      name: 'Test',
      address: '0x0',
      usd: 10,
      eth: 10 / 1500,
    };

    describe('without a currency', () => {
      it('returns the usd price', () => {
        const defaultPrice = inCurrency(priceData);
        expect(defaultPrice).toEqual(priceData.usd);
      });
    });

    describe('with usd selected', () => {
      it('returns the usd price', () => {
        const defaultPrice = inCurrency(priceData, 'usd');
        expect(defaultPrice).toEqual(priceData.usd);
      });
    });

    describe('with eth selected', () => {
      it('returns the eth price', () => {
        const ethPrice = inCurrency(priceData, 'eth');
        expect(ethPrice).toEqual(priceData.eth);
      });
    });

    describe('with an unsupported currency', () => {
      it('returns the usd price', () => {
        const ethPrice = inCurrency(priceData, 'bchabc');
        expect(ethPrice).toEqual(priceData.usd);
      });
    });
  });

  describe('getVaultTokenPrice', () => {
    describe('look up non vault token price', () => {
      it('throws a bad request error', async () => {
        await expect(getVaultTokenPrice(TOKENS.BADGER)).rejects.toThrow(BadRequest);
      });
    });
  });
});
