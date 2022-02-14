import { DataMapper } from '@aws/dynamodb-data-mapper';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { getToken, protocolTokens } from '../tokens/tokens.utils';
import {
  getContractPrice,
  getPrice,
  getPriceData,
  getTokenPrice,
  getVaultTokenPrice,
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
        const expected = noPrice(TOKENS.CAKE);
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
          updatedAt: Date.now(),
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
        await expect(updatePrice(TEST_ADDR)).rejects.toThrow(NotFound);
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await updatePrice(TOKENS.BADGER);
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
    it('Fetches the contract price in USD', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const price = Math.random() * 100;
      const mockResponse = {
        '0x3472a5a71965499acd81997a54bba8d852c6e53d': {
          usd: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getContractPrice(contract);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: contract,
        price,
      });
    });
  });

  describe('getTokenPrice', () => {
    it('Fetches the token price in USD and ETH', async () => {
      const token = 'Badger';
      const price = Math.random() * 100;
      const mockResponse = {
        Badger: {
          usd: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getTokenPrice(token);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: TOKENS.BADGER,
        price,
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
