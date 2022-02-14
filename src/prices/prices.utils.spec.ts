import { DataMapper } from '@aws/dynamodb-data-mapper';
import { NotFound } from '@tsed/exceptions';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { convert, getContractPrice, getPrice, getTokenPrice, updatePrice } from './prices.utils';
import * as requestUtils from '../etherscan/etherscan.utils';
import { Currency } from '@badger-dao/sdk';

describe('prices.utils', () => {
  const strategy = new TestStrategy();

  describe('getPrice', () => {
    describe('query encounters an error', () => {
      it('returns a price of 0', async () => {
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error('QueryError');
        });
        const cakePrice = await getPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        setupMapper([]);
        const cakePrice = await getPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        const price = await strategy.getPrice(TOKENS.BADGER);
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
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await expect(updatePrice(TEST_ADDR)).rejects.toThrow(NotFound);
        expect(put.mock.calls.length).toEqual(0);
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(TestStrategy.prototype, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: 0,
        }));
        const result = await updatePrice(TOKENS.BADGER);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        jest.spyOn(TestStrategy.prototype, 'getPrice').mockImplementation(async (token) => ({
          address: token,
          price: NaN,
        }));
        const result = await updatePrice(TOKENS.BADGER);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
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

    it('Throws error on missing prices', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const price = Math.random() * 100;
      const mockResponse = {
        [contract]: {
          eth: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
      await expect(getContractPrice(contract)).rejects.toThrow(`Unable to resolve ${contract} price by contract`);
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

    it('Throws error on missing prices', async () => {
      const token = 'Badger';
      const price = Math.random() * 100;
      const mockResponse = {
        Badger: {
          eth: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
      await expect(getTokenPrice(token)).rejects.toThrow(`Unable to resolve ${token} price by name`);
    });
  });

  describe('convert', () => {
    it.each([
      [3600, 3600, Currency.USD],
      [3600, 2, Currency.ETH],
    ])('converts %d USD to %s %s', async (price, conversion, currency) => {
      setupMapper([{ address: TOKENS.WETH, price: 1800 }]);
      const result = await convert(price, currency);
      expect(result).toEqual(conversion);
    });
  });
});
