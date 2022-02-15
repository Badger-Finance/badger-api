import { DataMapper } from '@aws/dynamodb-data-mapper';
import { NotFound } from '@tsed/exceptions';
import { TestStrategy } from '../chains/strategies/test.strategy';
import { TOKENS } from '../config/tokens.config';
import { setupMapper, TEST_ADDR, TEST_CHAIN } from '../test/tests.utils';
import { convert, fetchPrices, getPrice, updatePrice } from './prices.utils';
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
        await expect(updatePrice({ address: TEST_ADDR, price: 10 })).rejects.toThrow(NotFound);
        expect(put.mock.calls.length).toEqual(0);
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        const result = await updatePrice({ address: TOKENS.BADGER, price: 0 });
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        const result = await updatePrice({ address: TOKENS.BADGER, price: NaN });
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        await updatePrice({ address: TOKENS.BADGER, price: 10 });
        expect(put.mock.calls.length).toEqual(1);
      });
    });
  });

  describe('convert', () => {
    it.each([
      [3600, 3600, Currency.USD],
      [3600, 2, Currency.ETH],
      [3600, 1800, Currency.FTM],
    ])('converts %d USD to %s %s', async (price, conversion, currency) => {
      let cachedPrice;
      switch (currency) {
        case Currency.FTM:
          cachedPrice = { address: TOKENS.WFTM, price: 2 };
          break;
        default:
          cachedPrice = { address: TOKENS.WETH, price: 1800 };
      }
      setupMapper([cachedPrice]);
      const result = await convert(price, currency);
      expect(result).toEqual(conversion);
    });
  });

  describe('fetchPrices', () => {
    describe('request prices for contracts', () => {
      it('results in no prices with no requested addresses', async () => {
        const result = await fetchPrices(TEST_CHAIN, []);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { [TOKENS.BADGER]: { usd: 10 }, [TOKENS.WBTC]: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        await fetchPrices(TEST_CHAIN, [TOKENS.BADGER, TOKENS.WBTC]);
        expect(request.mock.calls[0][0]).toContain('/token_price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { [TOKENS.BADGER]: { usd: 10 }, [TOKENS.WBTC]: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        const result = await fetchPrices(TEST_CHAIN, [TOKENS.BADGER, TOKENS.WBTC]);
        expect(result).toMatchSnapshot();
      });
    });

    describe('request prices for look up names', () => {
      it('results in no prices with no requested addresses', async () => {
        const result = await fetchPrices(TEST_CHAIN, [], true);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        await fetchPrices(TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
        expect(request.mock.calls[0][0]).toContain('/price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        const result = await fetchPrices(TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
