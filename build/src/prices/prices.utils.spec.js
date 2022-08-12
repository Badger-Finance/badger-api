"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = require("@badger-dao/sdk");
const test_strategy_1 = require("../chains/strategies/test.strategy");
const requestUtils = tslib_1.__importStar(require("../common/request"));
const tokens_config_1 = require("../config/tokens.config");
const tests_utils_1 = require("../test/tests.utils");
const prices_utils_1 = require("./prices.utils");
describe('prices.utils', () => {
    const strategy = new test_strategy_1.TestStrategy();
    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(jest.fn);
    });
    describe('getPrice', () => {
        describe('query encounters an error', () => {
            it('returns a price of 0', async () => {
                jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation(() => {
                    throw new Error('QueryError');
                });
                const cakePrice = await (0, prices_utils_1.getPrice)(tokens_config_1.TOKENS.CAKE);
                expect(cakePrice).toBeDefined();
                const expected = { address: tokens_config_1.TOKENS.CAKE, price: 0 };
                expect(cakePrice).toMatchObject(expected);
            });
        });
        describe('when price is not available', () => {
            it('returns a price of 0', async () => {
                (0, tests_utils_1.setupMapper)([]);
                const cakePrice = await (0, prices_utils_1.getPrice)(tokens_config_1.TOKENS.CAKE);
                expect(cakePrice).toBeDefined();
                const expected = { address: tokens_config_1.TOKENS.CAKE, price: 0 };
                expect(cakePrice).toMatchObject(expected);
            });
        });
        describe('when price is available', () => {
            it('returns a token snapshot with the latest price data', async () => {
                const price = await strategy.getPrice(tokens_config_1.TOKENS.BADGER);
                (0, tests_utils_1.setupMapper)([price]);
                const fetchedBadgerPrice = await (0, prices_utils_1.getPrice)(tokens_config_1.TOKENS.BADGER);
                expect(fetchedBadgerPrice).toBeDefined();
                expect(fetchedBadgerPrice).toMatchObject(price);
            });
        });
    });
    describe('updatePrice', () => {
        describe('encounters an error from a price of 0', () => {
            it('returns the price of 0, but does not save the record', async () => {
                const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.updatePrice)({ address: tokens_config_1.TOKENS.BADGER, price: 0 });
                expect(put.mock.calls.length).toEqual(0);
                expect(result).toMatchObject({ address: tokens_config_1.TOKENS.BADGER, price: 0 });
            });
        });
        describe('encounters an error from a price of 0', () => {
            it('returns the price of NaN, but does not save the record', async () => {
                const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.updatePrice)({ address: tokens_config_1.TOKENS.BADGER, price: NaN });
                expect(put.mock.calls.length).toEqual(0);
                expect(result).toMatchObject({ address: tokens_config_1.TOKENS.BADGER, price: 0 });
            });
        });
        describe('update supported token', () => {
            it('creates an price db entry', async () => {
                const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
                (0, tests_utils_1.setFullTokenDataMock)();
                await (0, prices_utils_1.updatePrice)({ address: tokens_config_1.TOKENS.BADGER, price: 10 });
                expect(put.mock.calls.length).toEqual(1);
            });
        });
    });
    describe('convert', () => {
        it.each([
            [3600, 3600, sdk_1.Currency.USD],
            [3600, 2, sdk_1.Currency.ETH],
            [3600, 1800, sdk_1.Currency.FTM],
            [3600, 2400, sdk_1.Currency.MATIC],
        ])('converts %d USD to %s %s', async (price, conversion, currency) => {
            let cachedPrice;
            switch (currency) {
                case sdk_1.Currency.MATIC:
                    cachedPrice = { address: tokens_config_1.TOKENS.MATIC_WMATIC, price: 1.5 };
                    break;
                case sdk_1.Currency.FTM:
                    cachedPrice = { address: tokens_config_1.TOKENS.FTM_WFTM, price: 2 };
                    break;
                default:
                    cachedPrice = { address: tokens_config_1.TOKENS.WETH, price: 1800 };
            }
            (0, tests_utils_1.setupMapper)([cachedPrice]);
            const result = await (0, prices_utils_1.convert)(price, currency);
            expect(result).toEqual(conversion);
        });
    });
    describe('fetchPrices', () => {
        describe('request prices for contracts', () => {
            it('results in no prices with no requested addresses', async () => {
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, []);
                expect(result).toMatchObject({});
            });
            it('requests contracts endpoint', async () => {
                const mockResponse = { [tokens_config_1.TOKENS.BADGER]: { usd: 10 }, [tokens_config_1.TOKENS.WBTC]: { usd: 43500 } };
                const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
                (0, tests_utils_1.setFullTokenDataMock)();
                await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.WBTC]);
                expect(request.mock.calls[0][0]).toContain('/token_price');
            });
            it('returns a price map of requested token prices in usd', async () => {
                const mockResponse = { [tokens_config_1.TOKENS.BADGER]: { usd: 10 }, [tokens_config_1.TOKENS.WBTC]: { usd: 43500 } };
                jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.WBTC]);
                expect(result).toMatchSnapshot();
            });
        });
        describe('request prices for look up names', () => {
            it('results in no prices with no requested addresses', async () => {
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, [], true);
                expect(result).toMatchObject({});
            });
            it('requests contracts endpoint', async () => {
                const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
                const request = jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
                (0, tests_utils_1.setFullTokenDataMock)();
                await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
                expect(request.mock.calls[0][0]).toContain('/price');
            });
            it('returns a price map of requested token prices in usd', async () => {
                const mockResponse = { ['badger']: { usd: 10 }, ['wrapped-bitcoin']: { usd: 43500 } };
                jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, prices_utils_1.fetchPrices)(tests_utils_1.TEST_CHAIN, ['badger', 'wrapped-bitcoin'], true);
                expect(result).toMatchSnapshot();
            });
        });
    });
});
//# sourceMappingURL=prices.utils.spec.js.map