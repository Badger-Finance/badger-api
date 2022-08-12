"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const tokens_config_1 = require("../config/tokens.config");
const priceUtils = tslib_1.__importStar(require("../prices/prices.utils"));
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const vaultUtils = tslib_1.__importStar(require("../vaults/vaults.utils"));
const token_error_1 = require("./errors/token.error");
const full_token_mock_1 = require("./mocks/full-token.mock");
const tokens_utils_1 = require("./tokens.utils");
describe('token.utils', () => {
    beforeEach(() => {
        jest.spyOn(vaultUtils, 'getCachedVault').mockImplementation(async (chain, vault) => {
            (0, tests_utils_1.setFullTokenDataMock)();
            const defaultVault = await vaultUtils.defaultVault(chain, vault);
            defaultVault.balance = 10;
            return defaultVault;
        });
        (0, tests_utils_1.mockPricing)();
        jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
    });
    describe('toBalance', () => {
        describe('no requested currency', () => {
            it('converts to a usd based token balance', async () => {
                const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
                const price = {
                    address: badger.name,
                    price: 8,
                    updatedAt: Date.now(),
                };
                jest.spyOn(priceUtils, 'getPrice').mockImplementationOnce(async (_contract) => price);
                const actual = await (0, tokens_utils_1.toBalance)(badger, 10);
                const expected = {
                    name: badger.name,
                    address: badger.address,
                    symbol: badger.symbol,
                    decimals: badger.decimals,
                    balance: 10,
                    value: 80,
                };
                expect(actual).toEqual(expected);
            });
        });
        describe('with a requested currency', () => {
            it.each([sdk_1.Currency.USD, sdk_1.Currency.ETH])('converts to an %s based token balance', async (currency) => {
                const basePrice = 8;
                const convertedPrice = currency === sdk_1.Currency.ETH ? (basePrice * 8) / 3 : basePrice;
                const baseTokens = 10;
                const expectedValue = convertedPrice * baseTokens;
                const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
                jest.spyOn(priceUtils, 'getPrice').mockImplementation(async (token) => ({
                    address: token,
                    price: convertedPrice,
                    updatedAt: Date.now(),
                }));
                const actual = await (0, tokens_utils_1.toBalance)(badger, baseTokens, currency);
                const expected = {
                    name: badger.name,
                    address: badger.address,
                    symbol: badger.symbol,
                    decimals: badger.decimals,
                    balance: baseTokens,
                    value: expectedValue,
                };
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('mockBalance', () => {
        describe('no requested currency', () => {
            it('converts to a usd based token balance', () => {
                const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
                const mockPrice = parseInt(badger.address.slice(0, 5), 16);
                const actual = (0, tokens_utils_1.mockBalance)(badger, 1);
                const expected = {
                    name: badger.name,
                    address: badger.address,
                    symbol: badger.symbol,
                    decimals: badger.decimals,
                    balance: 1,
                    value: mockPrice,
                };
                expect(actual).toEqual(expected);
            });
        });
        describe('with a requested currency', () => {
            it.each([sdk_1.Currency.USD, sdk_1.Currency.ETH])('converts to an %s based token balance', (currency) => {
                const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
                let mockPrice = parseInt(badger.address.slice(0, 5), 16);
                if (currency !== sdk_1.Currency.USD) {
                    mockPrice /= 2;
                }
                const actual = (0, tokens_utils_1.mockBalance)(badger, 1, currency);
                const expected = {
                    name: badger.name,
                    address: badger.address,
                    symbol: badger.symbol,
                    decimals: badger.decimals,
                    balance: 1,
                    value: mockPrice,
                };
                expect(actual).toEqual(expected);
            });
        });
    });
    describe('getVaultTokens', () => {
        describe('no saved balances', () => {
            it('returns single token underlying balance', async () => {
                const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
                (0, tests_utils_1.setFullTokenDataMock)();
                const expected = (0, tokens_utils_1.mockBalance)(badger, 10);
                (0, tests_utils_1.setupMapper)([{ vault: constants_1.MOCK_VAULT_DEFINITION.address, tokenBalances: [expected] }]);
                const dto = await vaultUtils.defaultVault(tests_utils_1.TEST_CHAIN, constants_1.MOCK_VAULT_DEFINITION);
                const result = await (0, tokens_utils_1.getVaultTokens)(tests_utils_1.TEST_CHAIN, dto);
                expect(result).toMatchObject([expected]);
            });
        });
        describe('saved balances', () => {
            describe('no requested currency', () => {
                it('converts to a usd based token balance', async () => {
                    const wbtc = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC];
                    const weth = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WETH];
                    (0, tests_utils_1.setFullTokenDataMock)();
                    const dto = await vaultUtils.defaultVault(tests_utils_1.TEST_CHAIN, constants_1.MOCK_VAULT_DEFINITION);
                    const tokenBalances = [(0, tokens_utils_1.mockBalance)(wbtc, 1), (0, tokens_utils_1.mockBalance)(weth, 20)];
                    const cached = { vault: constants_1.MOCK_VAULT_DEFINITION.address, tokenBalances };
                    (0, tests_utils_1.setupMapper)([cached]);
                    const actual = await (0, tokens_utils_1.getVaultTokens)(tests_utils_1.TEST_CHAIN, dto);
                    expect(actual).toMatchObject(tokenBalances);
                });
            });
            describe('with a requested currency', () => {
                it.each([sdk_1.Currency.ETH, sdk_1.Currency.USD])('converts to an %s based token balance', async (currency) => {
                    const wbtc = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC];
                    const weth = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WETH];
                    (0, tests_utils_1.setFullTokenDataMock)();
                    const dto = await vaultUtils.defaultVault(tests_utils_1.TEST_CHAIN, constants_1.MOCK_VAULT_DEFINITION);
                    const tokenBalances = [(0, tokens_utils_1.mockBalance)(wbtc, 1), (0, tokens_utils_1.mockBalance)(weth, 20)];
                    const cached = { vault: constants_1.MOCK_VAULT_DEFINITION.address, tokenBalances };
                    (0, tests_utils_1.setupMapper)([cached]);
                    const expected = [(0, tokens_utils_1.mockBalance)(wbtc, 1, currency), (0, tokens_utils_1.mockBalance)(weth, 20, currency)];
                    const actual = await (0, tokens_utils_1.getVaultTokens)(tests_utils_1.TEST_CHAIN, dto, currency);
                    expect(actual).toMatchObject(expected);
                });
            });
        });
    });
    describe('getFullToken(s)', () => {
        it('throws token not found', async () => {
            const batchPutMock = (0, tests_utils_1.mockBatchPut)([]);
            const batchGetMock = (0, tests_utils_1.setupBatchGet)([]);
            const sdkLoadMock = jest.spyOn(sdk_1.TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));
            await expect((0, tokens_utils_1.getFullToken)(tests_utils_1.TEST_CHAIN, '0x0000000000000000000000000000000000000000')).rejects.toThrow(token_error_1.TokenNotFound);
            expect(batchGetMock).toBeCalled();
            expect(sdkLoadMock).toBeCalled();
            expect(batchPutMock).toBeCalledTimes(0);
        });
        it('takes token from cache', async () => {
            const batchPutMock = (0, tests_utils_1.mockBatchPut)([]);
            const batchGetMock = (0, tests_utils_1.setupBatchGet)(Object.values(full_token_mock_1.fullTokenMockMap));
            const sdkLoadMock = jest.spyOn(sdk_1.TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));
            const token = await (0, tokens_utils_1.getFullToken)(tests_utils_1.TEST_CHAIN, tokens_config_1.TOKENS.BADGER);
            expect(batchGetMock).toBeCalled();
            expect(sdkLoadMock).toBeCalledTimes(0);
            expect(batchPutMock).toBeCalledTimes(0);
            expect(token).toMatchObject(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER]);
        });
        it('takes token from sdk and saves it', async () => {
            const batchPutMock = (0, tests_utils_1.mockBatchPut)([]);
            const batchGetMock = (0, tests_utils_1.setupBatchGet)([]);
            const sdkLoadMock = jest
                .spyOn(sdk_1.TokensService.prototype, 'loadTokens')
                .mockImplementation(async () => ({ [tokens_config_1.TOKENS.BADGER]: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER] }));
            const token = await (0, tokens_utils_1.getFullToken)(tests_utils_1.TEST_CHAIN, tokens_config_1.TOKENS.BADGER);
            expect(batchGetMock).toBeCalled();
            expect(batchPutMock).toBeCalled();
            expect(sdkLoadMock).toBeCalled();
            expect(token).toMatchObject(full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER]);
        });
        it('returns empty object', async () => {
            const batchPutMock = (0, tests_utils_1.mockBatchPut)([]);
            const batchGetMock = (0, tests_utils_1.setupBatchGet)([]);
            const sdkLoadMock = jest.spyOn(sdk_1.TokensService.prototype, 'loadTokens').mockImplementation(async () => ({}));
            const tokens = await (0, tokens_utils_1.getFullTokens)(tests_utils_1.TEST_CHAIN, [
                '0x0000000000000000000000000000000000000000',
                '0x0000000000000000000000000000000000000001',
            ]);
            expect(batchGetMock).toBeCalled();
            expect(batchPutMock).toBeCalledTimes(0);
            expect(sdkLoadMock).toBeCalled();
            expect(tokens).toMatchObject({});
        });
        it('mixed cache and sdk get with save', async () => {
            const batchPutMock = (0, tests_utils_1.mockBatchPut)([]);
            const batchGetMock = (0, tests_utils_1.setupBatchGet)([full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER], full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC]]);
            const sdkLoadMock = jest
                .spyOn(sdk_1.TokensService.prototype, 'loadTokens')
                .mockImplementation(async () => ({ [tokens_config_1.TOKENS.WETH]: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WETH] }));
            const expectedTokensMap = {
                [tokens_config_1.TOKENS.BADGER]: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER],
                [tokens_config_1.TOKENS.WBTC]: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC],
                [tokens_config_1.TOKENS.WETH]: full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WETH],
            };
            const tokens = await (0, tokens_utils_1.getFullTokens)(tests_utils_1.TEST_CHAIN, [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.WBTC, tokens_config_1.TOKENS.WETH]);
            expect(batchGetMock).toBeCalled();
            expect(batchPutMock).toBeCalled();
            expect(sdkLoadMock).toBeCalled();
            expect(tokens).toMatchObject(expectedTokensMap);
        });
    });
});
//# sourceMappingURL=tokens.utils.spec.js.map