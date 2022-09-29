import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Currency } from '@badger-dao/sdk';

import * as dynamoDbUtils from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import * as requestUtils from '../common/request';
import { TOKENS } from '../config/tokens.config';
import * as balancerStrategy from '../protocols/strategies/balancer.strategy';
import * as curveStrategy from '../protocols/strategies/convex.strategy';
import * as uniswapStrategy from '../protocols/strategies/uniswap.strategy';
import { TEST_ADDR, TEST_CURRENT_TIMESTAMP, TEST_TOKEN } from '../test/constants';
import { mockQuery, setupMockChain } from '../test/mocks.utils';
import { mockPrice } from '../test/mocks.utils/mock.helpers';
import * as tokensUtils from '../tokens/tokens.utils';
import * as vaultsUtils from '../vaults/vaults.utils';
import { PricingType } from './enums/pricing-type.enum';
import { convert, fetchPrices, getPrice, queryPrice, queryPriceAtTimestamp, updatePrice } from './prices.utils';

describe('prices.utils', () => {
  const missingPrice = { address: TEST_TOKEN, price: 0 };
  const missingPriceSnapshot = { ...missingPrice, updatedAt: TEST_CURRENT_TIMESTAMP };

  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain({ pricing: false });
  });

  describe('queryPrice', () => {
    describe('query encounters an error', () => {
      it('returns a price of 0', async () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn);
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
        const price = mockPrice(TEST_TOKEN);
        mockQuery([price]);
        const queriedTokenPrice = await queryPrice(TEST_TOKEN);
        expect(queriedTokenPrice).toMatchObject(price);
      });
    });
  });

  describe('updatePrice', () => {
    describe('encounters an error from a price of 0', () => {
      it('returns the price of 0, but does not save the record', async () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn);
        const put = jest.spyOn(DataMapper.prototype, 'put').mockImplementation();
        const result = await updatePrice(missingPrice);
        expect(put.mock.calls.length).toEqual(0);
        expect(result).toMatchObject(missingPrice);
      });
    });

    describe('encounters an error from a price of NaN', () => {
      it('returns the price of NaN, but does not save the record', async () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn);
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
      [3600, 3600, undefined],
      [3600, 3600, Currency.USD],
      [3600, 2, Currency.ETH],
      [3600, 1800, Currency.FTM],
      [3600, 1200, Currency.AVAX],
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
        case Currency.AVAX:
          cachedPrice = { address: TEST_TOKEN, price: 3 };
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

  describe('queryPriceAtTimestamp', () => {
    describe('encounters an error', () => {
      it('returns the default projection', async () => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn);
        jest.spyOn(dynamoDbUtils, 'getDataMapper').mockImplementationOnce(() => {
          throw new Error('Expected test error: queryYieldEstimate error');
        });
        const result = await queryPriceAtTimestamp(TEST_TOKEN, TEST_CURRENT_TIMESTAMP);
        expect(result).toMatchObject(missingPriceSnapshot);
      });
    });

    describe('no token price exists', () => {
      it('returns the default token price', async () => {
        mockQuery([]);
        const result = await queryPriceAtTimestamp(TEST_TOKEN, TEST_CURRENT_TIMESTAMP);
        expect(result).toMatchObject(missingPriceSnapshot);
      });
    });

    describe('system has saved data', () => {
      it('returns the cached token price', async () => {
        const cachedPrice = await mockPrice(TEST_TOKEN);
        const mockedPrice = {
          ...cachedPrice,
          updatedAt: TEST_CURRENT_TIMESTAMP,
        };
        mockQuery([mockedPrice]);
        const result = await queryPriceAtTimestamp(TEST_TOKEN, TEST_CURRENT_TIMESTAMP);
        expect(result).toMatchObject(mockedPrice);
      });
    });
  });

  describe('getPrice', () => {
    describe('request price for token with undefined pricing method', () => {
      it('throws an unprocessable entity error', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementationOnce(async (_c, t) => {
          return {
            address: t,
            type: undefined,
          };
        });
        await expect(getPrice(chain, TEST_TOKEN)).rejects.toThrow('Unsupported PricingType');
      });
    });

    describe('request price for token with lookup name pricing method', () => {
      it('throws an unprocessable entity error', async () => {
        await expect(getPrice(chain, TOKENS.SBTC)).rejects.toThrow(
          'CoinGecko pricing should utilize fetchPrices via utilities',
        );
      });
    });

    describe('request price for token with custom pricing', () => {
      it('throws an unprocessable entity error for missing custom function', async () => {
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementationOnce(async (_c, t) => {
          return {
            address: t,
            type: PricingType.Custom,
            name: 'TEST TOKEN',
            symbol: 'TT',
            decimals: 18,
          };
        });
        await expect(getPrice(chain, TOKENS.SBTC)).rejects.toThrow('TEST TOKEN requires custom price implementation');
      });

      it('returns result of custom function', async () => {
        const mockedPrice = mockPrice(TEST_TOKEN);
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementationOnce(async (_c, t) => {
          return {
            address: t,
            type: PricingType.Custom,
            name: 'TEST TOKEN',
            symbol: 'TT',
            decimals: 18,
            getPrice: async (_c, t) => mockPrice(t.address),
          };
        });
        const result = await getPrice(chain, TEST_TOKEN);
        expect(result).toMatchObject(mockedPrice);
      });
    });

    describe('request price for token with on chain uni v2 pricing', () => {
      it('throws an unprocessable entity error for missing lookup name', async () => {
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementationOnce(async (_c, t) => {
          return {
            address: t,
            type: PricingType.OnChainUniV2LP,
            name: 'TEST TOKEN',
            symbol: 'TT',
            decimals: 18,
          };
        });
        await expect(getPrice(chain, TOKENS.SBTC)).rejects.toThrow(
          'TEST TOKEN required lookupName to utilize OnChainUniV2LP pricing',
        );
      });

      it('returns result of on chain look up', async () => {
        const mockedPrice = mockPrice(TEST_TOKEN);
        jest.spyOn(uniswapStrategy, 'resolveTokenPrice').mockImplementationOnce(async () => mockedPrice);
        jest.spyOn(tokensUtils, 'getFullToken').mockImplementationOnce(async (_c, t) => {
          return {
            address: t,
            type: PricingType.OnChainUniV2LP,
            name: 'TEST TOKEN',
            symbol: 'TT',
            decimals: 18,
            lookupName: TEST_TOKEN,
          };
        });
        const result = await getPrice(chain, TEST_TOKEN);
        expect(result).toMatchObject(mockedPrice);
      });
    });

    describe('request curve LP token price', () => {
      it('resolves prices based on curve LP pricing function', async () => {
        const mockedPrice = mockPrice(TOKENS.CRV_TRICRYPTO2);
        jest.spyOn(curveStrategy, 'getCurveTokenPrice').mockImplementationOnce(async () => mockedPrice);
        const result = await getPrice(chain, TOKENS.CRV_TRICRYPTO2);
        expect(result).toMatchObject(mockedPrice);
      });
    });

    describe('request uniswap LP token price', () => {
      it('resolves prices based on uniswap LP pricing function', async () => {
        const mockedPrice = mockPrice(TOKENS.UNI_BADGER_WBTC);
        jest.spyOn(uniswapStrategy, 'getOnChainLiquidityPrice').mockImplementationOnce(async () => mockedPrice);
        const result = await getPrice(chain, TOKENS.UNI_BADGER_WBTC);
        expect(result).toMatchObject(mockedPrice);
      });
    });

    describe('request vault token price', () => {
      it('resolves prices based on vault pricing function', async () => {
        const mockedPrice = mockPrice(TOKENS.BVECVX);
        jest.spyOn(vaultsUtils, 'getVaultTokenPrice').mockImplementationOnce(async () => mockedPrice);
        const result = await getPrice(chain, TOKENS.BVECVX);
        expect(result).toMatchObject(mockedPrice);
      });
    });

    describe('request vault token price', () => {
      it('resolves prices based on vault pricing function', async () => {
        const mockedPrice = mockPrice(TOKENS.BPT_BB_AAVE_USD);
        jest.spyOn(balancerStrategy, 'getBPTPrice').mockImplementationOnce(async () => mockedPrice);
        const result = await getPrice(chain, TOKENS.BPT_BB_AAVE_USD);
        expect(result).toMatchObject(mockedPrice);
      });
    });
  });
});
