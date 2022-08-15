import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Currency } from '@badger-dao/sdk';

import { Chain } from '../chains/config/chain.config';
import * as requestUtils from '../common/request';
import { TEST_ADDR, TEST_TOKEN } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { convert, fetchPrices, queryPrice, updatePrice } from './prices.utils';

describe('prices.utils', () => {
  const missingPrice = { address: TEST_TOKEN, price: 0 };

  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain({ pricing: false });
    jest.spyOn(console, 'error').mockImplementation(jest.fn);
  });

  describe('queryPrice', () => {
    describe('query encounters an error', () => {
      it('returns a price of 0', async () => {
        jest.spyOn(DataMapper.prototype, 'query').mockImplementation(() => {
          throw new Error('Expected test error: queryPrice no stored price');
        });
        const testPrice = await queryPrice(TEST_TOKEN);
        expect(testPrice).toMatchObject(missingPrice);
      });
    });

    describe('when price is not available', () => {
      it('returns a price of 0', async () => {
        mockQuery([]);
        const price = await queryPrice(TEST_TOKEN);
        expect(price).toMatchObject(missingPrice);
      });
    });

    describe('when price is available', () => {
      it('returns a token snapshot with the latest price data', async () => {
        const price = chain.strategy.getPrice(TEST_TOKEN);
        mockQuery([price]);
        const queriedTokenPrice = await queryPrice(TEST_TOKEN);
        expect(queriedTokenPrice).toMatchObject(price);
      });
    });
  });

  describe('updatePrice', () => {
    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        const result = await updatePrice(missingPrice);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject(missingPrice);
      });
    });

    describe('encounters an error from a price of NaN', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        const result = await updatePrice({ address: TEST_TOKEN, price: NaN });
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject(missingPrice);
      });
    });

    describe('update supported token', () => {
      it('creates an price db entry', async () => {
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation(async (item) => item);
        const expected = { address: TEST_TOKEN, price: 10 };
        const result = await updatePrice(expected);
        expect(put.mock.calls.length).toEqual(1);
        expect(result).toMatchObject(result);
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
          cachedPrice = { address: TEST_TOKEN, price: 1.5 };
          break;
        case Currency.FTM:
          cachedPrice = { address: TEST_TOKEN, price: 2 };
          break;
        default:
          cachedPrice = { address: TEST_TOKEN, price: 1800 };
      }
      mockQuery([cachedPrice]);
      const result = await convert(price, currency);
      expect(result).toEqual(conversion);
    });
  });

  describe('fetchPrices', () => {
    describe('request prices for contracts', () => {
      it('results in no prices with no requested addresses', async () => {
        const result = await fetchPrices(chain, []);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { [TEST_TOKEN]: { usd: 10 }, [TEST_ADDR]: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        await fetchPrices(chain, [TEST_TOKEN, TEST_ADDR]);
        expect(request.mock.calls[0][0]).toContain('/token_price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { [TEST_TOKEN]: { usd: 10 }, [TEST_ADDR]: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        const result = await fetchPrices(chain, [TEST_TOKEN, TEST_ADDR]);
        expect(result).toMatchSnapshot();
      });
    });

    describe('request prices for look up names', () => {
      it('results in no prices with no requested addresses', async () => {
        const result = await fetchPrices(chain, [], true);
        expect(result).toMatchObject({});
      });

      it('requests contracts endpoint', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        await fetchPrices(chain, ['badger', 'wrapped-bitcoin'], true);
        expect(request.mock.calls[0][0]).toContain('/price');
      });

      it('returns a price map of requested token prices in usd', async () => {
        const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
        jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
        const result = await fetchPrices(chain, ['badger', 'wrapped-bitcoin'], true);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
