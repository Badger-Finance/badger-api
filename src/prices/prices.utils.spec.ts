import { DataMapper } from '@aws/dynamodb-data-mapper';
import { TOKENS } from '../config/tokens.config';
import * as requestUtils from '../common/request';
import { mockPricing, setFullTokenDataMock, setupMapper, TEST_CHAIN } from '../test/tests.utils';
import { convert, fetchPrices, queryPrice, updatePrice } from './prices.utils';
import { Currency } from '@badger-dao/sdk';

describe('prices.utils', () => {
  describe('queryPrice', () => {
    describe('query encounters an error', () => {
      it('returns a price of 0', async () => {
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error('QueryError');
        });
        const cakePrice = await queryPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        setupMapper([]);
        const cakePrice = await queryPrice(TOKENS.CAKE);
        expect(cakePrice).toBeDefined();
        const expected = { address: TOKENS.CAKE, price: 0 };
        expect(cakePrice).toMatchObject(expected);
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        mockPricing();
        const fetchedBadgerPrice = await queryPrice(TOKENS.BADGER);
        expect(fetchedBadgerPrice).toMatchSnapshot();
      });
    });
  });

  describe('updatePrice', () => {
    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        setFullTokenDataMock();
        const result = await updatePrice({ address: TOKENS.BADGER, price: 0 });
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('encounters an error from a price of 0', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        setFullTokenDataMock();
        const result = await updatePrice({ address: TOKENS.BADGER, price: NaN });
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject({ address: TOKENS.BADGER, price: 0 });
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        setFullTokenDataMock();
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
      [3600, 2400, Currency.MATIC],
    ])('converts %d USD to %s %s', async (price, conversion, currency) => {
      let cachedPrice;
      switch (currency) {
        case Currency.MATIC:
          cachedPrice = { address: TOKENS.MATIC_WMATIC, price: 1.5 };
          break;
        case Currency.FTM:
          cachedPrice = { address: TOKENS.FTM_WFTM, price: 2 };
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
        setFullTokenDataMock();
        const result = await fetchPrices(TEST_CHAIN, []);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { [TOKENS.BADGER]: { usd: 10 }, [TOKENS.WBTC]: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        setFullTokenDataMock();
        await fetchPrices(TEST_CHAIN, [TOKENS.BADGER, TOKENS.WBTC]);
        expect(request.mock.calls[0][0]).toContain('/token_price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { [TOKENS.BADGER]: { usd: 10 }, [TOKENS.WBTC]: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        setFullTokenDataMock();
        const result = await fetchPrices(TEST_CHAIN, [TOKENS.BADGER, TOKENS.WBTC]);
        expect(result).toMatchSnapshot();
      });
    });

    describe('request prices for look up names', () => {
      it('results in no prices with no requested addresses', async () => {
        setFullTokenDataMock();
        const result = await fetchPrices(TEST_CHAIN, [], true);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        setFullTokenDataMock();
        await fetchPrices(TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
        expect(request.mock.calls[0][0]).toContain('/price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        setFullTokenDataMock();
        const result = await fetchPrices(TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
