"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const chain_config_1 = require("../chains/config/chain.config");
const tokens_config_1 = require("../config/tokens.config");
const leaderboard_type_enum_1 = require("../leaderboards/enums/leaderboard-type.enum");
const user_claim_metadata_1 = require("../rewards/entities/user-claim-metadata");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaultsUtils = tslib_1.__importStar(require("../vaults/vaults.utils"));
const accounts_utils_1 = require("./accounts.utils");
describe('accounts.utils', () => {
    const mockBoost = {
        address: constants_1.TEST_ADDR,
        boost: 1,
        boostRank: 0,
        bveCvxBalance: 0,
        diggBalance: 0,
        leaderboard: `${tests_utils_1.TEST_CHAIN.network}_${leaderboard_type_enum_1.LeaderBoardType.BadgerBoost}`,
        nativeBalance: 0,
        nftBalance: 0,
        nonNativeBalance: 0,
        stakeRatio: 0,
        updatedAt: 0,
    };
    function testVaultBalance(vaultDefinition) {
        const vaultToken = full_token_mock_1.fullTokenMockMap[vaultDefinition.address];
        const depositToken = full_token_mock_1.fullTokenMockMap[vaultDefinition.depositToken];
        const toWei = (amt) => {
            const values = amt * Math.pow(10, vaultToken.decimals);
            return values.toString();
        };
        return {
            id: constants_1.TEST_ADDR,
            netDeposit: 4,
            netShareDeposit: toWei(4),
            grossDeposit: 9,
            grossShareDeposit: toWei(9),
            grossWithdraw: 5,
            grossShareWithdraw: toWei(5),
            user: {
                id: constants_1.TEST_ADDR,
                settBalances: [],
            },
            sett: {
                id: vaultToken.address,
                name: vaultToken.name,
                symbol: vaultToken.symbol,
                available: 1,
                pricePerFullShare: 1034039284374221,
                balance: 3,
                totalSupply: 5,
                netDeposit: 4,
                netShareDeposit: toWei(4),
                grossDeposit: 9,
                grossShareDeposit: toWei(9),
                grossWithdraw: 5,
                grossShareWithdraw: toWei(5),
                decimals: 18,
                token: {
                    id: depositToken.address,
                    name: depositToken.name,
                    symbol: depositToken.symbol,
                    decimals: depositToken.decimals,
                    totalSupply: 21000000,
                },
                treeDistributions: [],
                harvests: [],
                version: sdk_1.VaultVersion.v1_5,
                status: sdk_1.VaultStatus.guarded,
                isProduction: true,
                protocol: sdk_1.Protocol.Badger,
                createdAt: 0,
                behavior: sdk_1.VaultBehavior.Compounder,
                lastUpdatedAt: 0,
                releasedAt: 0,
            },
        };
    }
    beforeEach(() => {
        jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation(async (o) => ({
            ...o,
            updatedAt: 0,
        }));
        jest.spyOn(console, 'log').mockImplementation(jest.fn);
        (0, tests_utils_1.setFullTokenDataMock)();
    });
    describe('queryCachedAccount', () => {
        describe('no saved account', () => {
            it('returns undefined', async () => {
                (0, tests_utils_1.setupMapper)([]);
                const actual = await (0, accounts_utils_1.queryCachedAccount)(constants_1.TEST_ADDR);
                expect(actual).toMatchObject((0, tests_utils_1.defaultAccount)(constants_1.TEST_ADDR));
            });
        });
        describe('encounters an errors', () => {
            it('returns undefined', async () => {
                jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation(() => {
                    throw new Error();
                });
                const actual = await (0, accounts_utils_1.queryCachedAccount)(constants_1.TEST_ADDR);
                expect(actual).toMatchObject((0, tests_utils_1.defaultAccount)(constants_1.TEST_ADDR));
            });
        });
        describe('a saved account', () => {
            it('returns the stored account', async () => {
                const expected = { address: constants_1.TEST_ADDR, claimableBalances: [] };
                (0, tests_utils_1.setupMapper)([expected]);
                const actual = await (0, accounts_utils_1.queryCachedAccount)(constants_1.TEST_ADDR);
                expect(actual).toMatchObject(expected);
            });
        });
    });
    describe('getAccounts', () => {
        describe('users exist', () => {
            it('returns a list of user accounts', async () => {
                const mockAccounts = [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.DIGG, tokens_config_1.TOKENS.WBTC, tokens_config_1.TOKENS.FTM_GEIST];
                const result = {
                    users: mockAccounts.map((account) => ({ id: account, settBalances: [] })),
                };
                let responded = false;
                jest.spyOn(chain_config_1.Chain.prototype, 'getSdk').mockImplementation(async () => tests_utils_1.TEST_CHAIN.sdk);
                jest.spyOn(tests_utils_1.TEST_CHAIN.sdk.graph, 'loadUsers').mockImplementation(async (_a) => {
                    if (responded) {
                        return { users: [] };
                    }
                    responded = true;
                    return result;
                });
                const users = await (0, accounts_utils_1.getAccounts)(tests_utils_1.TEST_CHAIN);
                expect(users).toMatchObject(mockAccounts);
            });
        });
        describe('users do not exist', () => {
            it('returns an empty list', async () => {
                jest.spyOn(sdk_1.default.prototype, 'ready');
                jest.spyOn(chain_config_1.Chain.prototype, 'getSdk').mockImplementation(async () => tests_utils_1.TEST_CHAIN.sdk);
                jest.spyOn(tests_utils_1.TEST_CHAIN.sdk.graph, 'loadUsers').mockImplementationOnce(async () => ({ users: [] }));
                const nullReturn = await (0, accounts_utils_1.getAccounts)(tests_utils_1.TEST_CHAIN);
                expect(nullReturn).toMatchObject([]);
            });
        });
    });
    describe('toVaultBalance', () => {
        const chain = tests_utils_1.TEST_CHAIN;
        describe('digg token conversion', () => {
            it.each([
                [undefined, sdk_1.Currency.USD],
                [sdk_1.Currency.USD, sdk_1.Currency.USD],
                [sdk_1.Currency.ETH, sdk_1.Currency.ETH],
            ])('returns vault balance request in %s currency with %s denominated value', async (currency, _toCurrency) => {
                (0, tests_utils_1.mockChainVaults)();
                const snapshot = (0, tests_utils_1.randomSnapshot)(constants_1.MOCK_VAULT_DEFINITION);
                const cachedVault = await vaultsUtils.defaultVault(chain, constants_1.MOCK_VAULT_DEFINITION);
                cachedVault.balance = snapshot.balance;
                cachedVault.pricePerFullShare = snapshot.balance / snapshot.totalSupply;
                jest.spyOn(vaultsUtils, 'getCachedVault').mockImplementation(async (_c, _v) => cachedVault);
                const depositToken = full_token_mock_1.fullTokenMockMap[cachedVault.underlyingToken];
                (0, tests_utils_1.mockPricing)();
                (0, tests_utils_1.setFullTokenDataMock)();
                const wbtc = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC];
                const weth = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WETH];
                const tokenBalances = [(0, tokens_utils_1.mockBalance)(wbtc, 1), (0, tokens_utils_1.mockBalance)(weth, 20)];
                const cached = { vault: constants_1.MOCK_VAULT_DEFINITION.address, tokenBalances };
                (0, tests_utils_1.setupMapper)([cached]);
                const mockedBalance = testVaultBalance(constants_1.MOCK_VAULT_DEFINITION);
                const actual = await (0, accounts_utils_1.toVaultBalance)(chain, mockedBalance, currency);
                expect(actual).toBeTruthy();
                expect(actual.name).toEqual(constants_1.MOCK_VAULT_DEFINITION.name);
                expect(actual.symbol).toEqual(depositToken.symbol);
                expect(actual.pricePerFullShare).toEqual(snapshot.balance / snapshot.totalSupply);
            });
        });
    });
    describe('getCachedBoost', () => {
        describe('no cached boost', () => {
            it('returns the default boost', async () => {
                (0, tests_utils_1.setupMapper)([]);
                const result = await (0, accounts_utils_1.getCachedBoost)(tests_utils_1.TEST_CHAIN, constants_1.TEST_ADDR);
                expect(result).toMatchObject(mockBoost);
            });
        });
        describe('a previously cached boost', () => {
            it('returns the default boost', async () => {
                mockBoost.boostRank = 42;
                mockBoost.stakeRatio = 1;
                mockBoost.nativeBalance = 32021;
                mockBoost.nonNativeBalance = 32021;
                (0, tests_utils_1.setupMapper)([mockBoost]);
                const result = await (0, accounts_utils_1.getCachedBoost)(tests_utils_1.TEST_CHAIN, constants_1.TEST_ADDR);
                expect(result).toMatchObject(mockBoost);
            });
        });
    });
    describe('getLatestMetadata', () => {
        it('should not create new meta obj if exists', async () => {
            const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
            const meta = Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
                startBlock: 100,
                endBlock: 101,
                chainStartBlock: `${tests_utils_1.TEST_CHAIN.network}_123123`,
                chain: tests_utils_1.TEST_CHAIN.network,
                count: 0,
            });
            (0, tests_utils_1.setupMapper)([meta]);
            const latest_meta = await (0, accounts_utils_1.getLatestMetadata)(tests_utils_1.TEST_CHAIN);
            expect(latest_meta).toEqual(meta);
            expect(put.mock.calls).toEqual([]);
        });
        it('should create new meta if no meta obj found', async () => {
            const put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'put').mockImplementation();
            const mockedBlockNumber = 100;
            jest.spyOn(tests_utils_1.TEST_CHAIN.provider, 'getBlockNumber').mockImplementation(() => Promise.resolve(mockedBlockNumber));
            const expected = Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
                startBlock: 100,
                endBlock: 101,
                chainStartBlock: `${tests_utils_1.TEST_CHAIN.network}_${mockedBlockNumber}`,
                chain: tests_utils_1.TEST_CHAIN.network,
                count: 0,
            });
            (0, tests_utils_1.setupMapper)([]);
            await (0, accounts_utils_1.getLatestMetadata)(tests_utils_1.TEST_CHAIN);
            expect(put.mock.calls[0][0]).toEqual(expected);
        });
    });
});
//# sourceMappingURL=accounts.utils.spec.js.map