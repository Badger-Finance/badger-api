"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const exceptions_1 = require("@tsed/exceptions");
const ethers_1 = require("ethers");
const polygon_config_1 = require("../chains/config/polygon.config");
const chain_vaults_1 = require("../chains/vaults/chain.vaults");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const indexerUtils = tslib_1.__importStar(require("../indexers/indexer.utils"));
const pricesUtils = tslib_1.__importStar(require("../prices/prices.utils"));
const bouncer_type_enum_1 = require("../rewards/enums/bouncer-type.enum");
const source_type_enum_1 = require("../rewards/enums/source-type.enum");
const rewardsUtils = tslib_1.__importStar(require("../rewards/rewards.utils"));
const constants_2 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const token_error_1 = require("../tokens/errors/token.error");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokenUtils = tslib_1.__importStar(require("../tokens/tokens.utils"));
const vaults_graph_sdk_map_mock_1 = require("./mocks/vaults-graph-sdk-map.mock");
const vaults_harvests_sdk_mock_1 = require("./mocks/vaults-harvests-sdk.mock");
const vaults_utils_1 = require("./vaults.utils");
const yields_utils_1 = require("./yields.utils");
describe('vaults.utils', () => {
    beforeEach(() => {
        console.log = jest.fn();
        (0, tests_utils_1.mockChainVaults)();
        jest.spyOn(sdk_1.BadgerGraph.prototype, 'loadSettHarvests').mockImplementation(async (_options) => {
            const harvests = [
                {
                    id: '',
                    blockNumber: '10',
                    timestamp: 1640159886,
                    amount: '80000000000000000000',
                    token: {
                        id: '',
                        symbol: '',
                        name: '',
                        decimals: '',
                        totalSupply: '',
                    },
                },
                {
                    id: '',
                    blockNumber: '10',
                    timestamp: 1642159886,
                    amount: '100000000000000000000',
                    token: {
                        id: '',
                        symbol: '',
                        name: '',
                        decimals: '',
                        totalSupply: '',
                    },
                },
                {
                    id: '',
                    blockNumber: '10',
                    timestamp: 1645159886,
                    amount: '125000000000000000000',
                    token: {
                        id: '',
                        symbol: '',
                        name: '',
                        decimals: '',
                        totalSupply: '',
                    },
                },
            ];
            return {
                settHarvests: harvests,
            };
        });
        jest.spyOn(sdk_1.BadgerGraph.prototype, 'loadBadgerTreeDistributions').mockImplementation(async () => ({
            badgerTreeDistributions: [],
        }));
        jest.spyOn(sdk_1.TokensService.prototype, 'loadToken').mockImplementation(async (address) => ({
            address,
            decimals: 18,
            symbol: 'TEST',
            name: 'TEST',
        }));
        const snapshot = (0, tests_utils_1.randomSnapshot)(constants_2.MOCK_VAULT_DEFINITION);
        snapshot.value = 1000;
        snapshot.balance = 10000;
        (0, tests_utils_1.setupMapper)([snapshot]);
        jest.spyOn(indexerUtils, 'getVault').mockImplementation(async (_chain, _address) => ({
            sett: {
                id: constants_2.TEST_ADDR,
                balance: '2500000000000000000000',
                available: 0,
                netDeposit: 0,
                netShareDeposit: 0,
                token: {
                    symbol: 'TEST',
                    name: 'TEST',
                    id: constants_2.TEST_ADDR,
                    decimals: 18,
                    totalSupply: 3,
                },
                pricePerFullShare: 1,
                totalSupply: 10,
                symbol: 'TEST',
                name: 'TEST',
                decimals: 18,
                grossDeposit: 1,
                grossShareDeposit: 1,
                grossShareWithdraw: 1,
                grossWithdraw: 1,
                strategy: {
                    id: constants_2.TEST_ADDR,
                    balance: '2500000000000000000000',
                },
                version: sdk_1.VaultVersion.v1_5,
                status: sdk_1.VaultStatus.guarded,
                isProduction: true,
                protocol: sdk_1.Protocol.Badger,
                createdAt: 0,
                behavior: sdk_1.VaultBehavior.Compounder,
                lastUpdatedAt: 0,
                releasedAt: 0,
            },
        }));
        jest.spyOn(rewardsUtils, 'getProtocolValueSources').mockImplementation(async (_chain, vault) => {
            return [(0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.TradeFee, 'Test LP Fees', 1.13)];
        });
    });
    function setupSdk() {
        jest.spyOn(sdk_1.VaultsService.prototype, 'listHarvests').mockImplementation(async (opts) => {
            if (!opts.timestamp_gte) {
                throw new Error('Invalid request!');
            }
            const startTime = opts.timestamp_gte;
            const data = [0, 1, 2].map((int) => {
                const timestamp = Number((startTime + int * constants_1.ONE_DAY_SECONDS * 14).toFixed());
                const block = Number((timestamp / 10000).toFixed());
                return {
                    timestamp,
                    harvests: [
                        { timestamp, block, token: tokens_config_1.TOKENS.CRV_IBBTC, amount: ethers_1.BigNumber.from((int + 1 * 1.88e18).toString()) },
                    ],
                    treeDistributions: [
                        { timestamp, block, token: tokens_config_1.TOKENS.BCVXCRV, amount: ethers_1.BigNumber.from((int + 1 * 5.77e12).toString()) },
                        { timestamp, block, token: tokens_config_1.TOKENS.BVECVX, amount: ethers_1.BigNumber.from((int + 1 * 4.42e12).toString()) },
                    ],
                };
            });
            return { data };
        });
    }
    beforeEach(() => {
        jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
        jest.spyOn(rewardsUtils, 'getRewardEmission').mockImplementation(async (_chain, vault) => {
            return [(0, yields_utils_1.createYieldSource)(vault, source_type_enum_1.SourceType.Emission, 'Badger Rewards', 6.969, { min: 1, max: 2 })];
        });
    });
    const setupTestVaultHarvests = () => {
        jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async (_, tokenAddr) => {
            return full_token_mock_1.fullTokenMockMap[tokenAddr] || full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
        });
        // eslint-disable-next-line
        jest.spyOn(sdk_1.VaultsService.prototype, 'listHarvests').mockImplementation(async ({ address }) => {
            return vaults_harvests_sdk_mock_1.vaultsHarvestsSdkMock[address];
        });
        /* eslint-disable @typescript-eslint/ban-ts-comment */
        jest
            .spyOn(sdk_1.BadgerGraph.prototype, 'loadSett')
            .mockImplementation(async ({ id, block }) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return vaults_graph_sdk_map_mock_1.vaultsGraphSdkMapMock[`${id.toLowerCase()}-${(block || {}).number || 0}`];
        });
        jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
    };
    describe('defaultVault', () => {
        it('returns a sett default fields', async () => {
            var _a, _b;
            const depositToken = full_token_mock_1.fullTokenMockMap[constants_2.MOCK_VAULT_DEFINITION.depositToken];
            const settToken = full_token_mock_1.fullTokenMockMap[constants_2.MOCK_VAULT_DEFINITION.address];
            const expected = {
                asset: depositToken.symbol,
                vaultAsset: settToken.symbol,
                state: constants_2.MOCK_VAULT_DEFINITION.state,
                apr: 0,
                apy: 0,
                minApr: 0,
                minApy: 0,
                maxApr: 0,
                maxApy: 0,
                balance: 0,
                available: 0,
                boost: {
                    enabled: false,
                    weight: 0,
                },
                bouncer: (_a = constants_2.MOCK_VAULT_DEFINITION.bouncer) !== null && _a !== void 0 ? _a : bouncer_type_enum_1.BouncerType.None,
                name: constants_2.MOCK_VAULT_DEFINITION.name,
                protocol: sdk_1.Protocol.Badger,
                pricePerFullShare: 1,
                sources: [],
                sourcesApy: [],
                tokens: [],
                underlyingToken: constants_2.MOCK_VAULT_DEFINITION.depositToken,
                value: 0,
                vaultToken: constants_2.MOCK_VAULT_DEFINITION.address,
                strategy: {
                    address: ethers_1.ethers.constants.AddressZero,
                    withdrawFee: 0,
                    performanceFee: 0,
                    strategistFee: 0,
                    aumFee: 0,
                },
                type: constants_2.MOCK_VAULT_DEFINITION.protocol === sdk_1.Protocol.Badger ? sdk_1.VaultType.Native : sdk_1.VaultType.Standard,
                behavior: (_b = constants_2.MOCK_VAULT_DEFINITION.behavior) !== null && _b !== void 0 ? _b : sdk_1.VaultBehavior.None,
                lastHarvest: 0,
                yieldProjection: {
                    yieldApr: 0,
                    yieldTokens: [],
                    yieldPeriodApr: 0,
                    yieldPeriodSources: [],
                    yieldValue: 0,
                    harvestApr: 0,
                    harvestPeriodApr: 0,
                    harvestPeriodApy: 0,
                    harvestTokens: [],
                    harvestPeriodSources: [],
                    harvestPeriodSourcesApy: [],
                    harvestValue: 0,
                    nonHarvestApr: 0,
                    nonHarvestApy: 0,
                    nonHarvestSources: [],
                    nonHarvestSourcesApy: [],
                },
                version: sdk_1.VaultVersion.v1,
            };
            (0, tests_utils_1.setFullTokenDataMock)();
            const actual = await (0, vaults_utils_1.defaultVault)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
            expect(actual).toMatchObject(expected);
        });
    });
    describe('getCachedVault', () => {
        describe('no cached vault exists', () => {
            it('returns the default sett', async () => {
                (0, tests_utils_1.setupMapper)([]);
                (0, tests_utils_1.setFullTokenDataMock)();
                const cached = await (0, vaults_utils_1.getCachedVault)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                const defaultVaultInst = await (0, vaults_utils_1.defaultVault)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expect(cached).toMatchObject(defaultVaultInst);
            });
        });
        describe('a cached vault exists', () => {
            it('returns the vault', async () => {
                const snapshot = (0, tests_utils_1.randomSnapshot)(constants_2.MOCK_VAULT_DEFINITION);
                (0, tests_utils_1.setupMapper)([snapshot]);
                (0, tests_utils_1.setFullTokenDataMock)();
                const cached = await (0, vaults_utils_1.getCachedVault)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                const expected = await (0, vaults_utils_1.defaultVault)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expected.available = snapshot.available;
                expected.pricePerFullShare = snapshot.balance / snapshot.totalSupply;
                expected.balance = snapshot.balance;
                expected.value = snapshot.value;
                expected.boost = {
                    enabled: snapshot.boostWeight > 0,
                    weight: snapshot.boostWeight,
                };
                expect(cached).toMatchObject(expected);
            });
        });
    });
    describe('getVaultTokenPrice', () => {
        describe('look up non vault token price', () => {
            it('throws a bad request error', async () => {
                (0, tests_utils_1.setFullTokenDataMock)();
                await expect((0, vaults_utils_1.getVaultTokenPrice)(tests_utils_1.TEST_CHAIN, tokens_config_1.TOKENS.BADGER)).rejects.toThrow(exceptions_1.BadRequest);
            });
        });
        describe('look up malformed token configuration', () => {
            it('throws an unprocessable entity error', async () => {
                (0, tests_utils_1.setFullTokenDataMock)();
                await expect((0, vaults_utils_1.getVaultTokenPrice)(tests_utils_1.TEST_CHAIN, ethers_1.ethers.constants.AddressZero)).rejects.toThrow(token_error_1.TokenNotFound);
            });
        });
        describe('look up valid, properly configured vault', () => {
            it('returns a valid token price for the vault base on price per full share', async () => {
                const snapshot = (0, tests_utils_1.randomSnapshot)(constants_2.MOCK_VAULT_DEFINITION);
                (0, tests_utils_1.setupMapper)([snapshot]);
                jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (address) => ({ address, price: 10 }));
                (0, tests_utils_1.setFullTokenDataMock)();
                const vaultPrice = await (0, vaults_utils_1.getVaultTokenPrice)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION.address);
                expect(vaultPrice).toMatchObject({
                    address: constants_2.MOCK_VAULT_DEFINITION.address,
                    price: 10 * snapshot.pricePerFullShare,
                });
            });
        });
    });
    describe('getVaultPerformance', () => {
        describe('no rewards or harvests', () => {
            it('returns value sources from fallback methods', async () => {
                jest.spyOn(sdk_1.VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => ({ data: [] }));
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, vaults_utils_1.getVaultPerformance)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expect(result).toMatchSnapshot();
            });
        });
        describe('requests non standard vault performance', () => {
            it('returns value sources from fallback methods', async () => {
                jest.spyOn(sdk_1.VaultsService.prototype, 'listHarvests').mockImplementation(async (_opts) => {
                    throw new Error('Incompatible vault!');
                });
                (0, tests_utils_1.setupMapper)((0, tests_utils_1.randomSnapshots)(constants_2.MOCK_VAULT_DEFINITION));
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, vaults_utils_1.getVaultPerformance)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expect(result).toMatchSnapshot();
            });
        });
        describe('requests non compatible network vault performances', () => {
            it('returns value sources from fallback methods', async () => {
                const alternateChain = new polygon_config_1.Polygon();
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, vaults_utils_1.getVaultPerformance)(alternateChain, constants_2.MOCK_VAULT_DEFINITION);
                expect(result).toMatchSnapshot();
            });
        });
        describe('requests standard vault performance', () => {
            it('returns value sources from standard methods', async () => {
                setupSdk();
                jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => ({
                    address: token,
                    price: Number(token.slice(0, 4)),
                }));
                (0, tests_utils_1.setupMapper)([(0, yields_utils_1.createYieldSource)(constants_2.MOCK_VAULT_DEFINITION, source_type_enum_1.SourceType.PreCompound, vaults_utils_1.VAULT_SOURCE, 10)]);
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, vaults_utils_1.getVaultPerformance)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expect(result).toMatchSnapshot();
            });
            it('skips all emitted tokens with no price', async () => {
                setupSdk();
                jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token) => {
                    if (token !== constants_2.MOCK_VAULT_DEFINITION.depositToken) {
                        return {
                            address: token,
                            price: 0,
                        };
                    }
                    return {
                        address: token,
                        price: Number(token.slice(0, 4)),
                    };
                });
                (0, tests_utils_1.setFullTokenDataMock)();
                const result = await (0, vaults_utils_1.getVaultPerformance)(tests_utils_1.TEST_CHAIN, constants_2.MOCK_VAULT_DEFINITION);
                expect(result).toMatchSnapshot();
            });
        });
    });
    describe('estimateDerivativeEmission', () => {
        it.each([
            // enumerate all test cases above / below 100% apr
            [3.4883, 6.7204, 6.7204, 94.20314377878076],
            [3.4883, 6.7204, 0.7204, 12.45153507752425],
            [3.4883, 0.7204, 6.7204, 80.69651967371782],
            [3.4883, 0.7204, 0.7204, 3.529515865690866],
            [0.4883, 6.7204, 6.7204, 98.7771522235121],
            [0.4883, 6.7204, 0.7204, 26.1556767065858],
            [0.4883, 0.7204, 0.7204, 13.257249960438303],
        ])('Estimates derived emission from (%d compound, %d emission, %d compound emission) as %d%%', (compound, emission, compoundEmission, expected) => {
            expect((0, vaults_utils_1.estimateDerivativeEmission)(compound, emission, compoundEmission)).toEqual(expected);
        });
    });
    describe('getVaultHarvestsOnChain', () => {
        const TEST_VAULT = tokens_config_1.TOKENS.BCRV_SBTC;
        it('returns vaults harvests with apr', async () => {
            setupTestVaultHarvests();
            expect(await (0, vaults_utils_1.getVaultHarvestsOnChain)(tests_utils_1.TEST_CHAIN, TEST_VAULT)).toMatchSnapshot();
        });
        it('returns empty harvests for unknown vault', async () => {
            setupTestVaultHarvests();
            jest.spyOn(chain_vaults_1.ChainVaults.prototype, 'getVault').mockImplementation(async (_) => {
                throw new Error('Missing Vault');
            });
            await expect((0, vaults_utils_1.getVaultHarvestsOnChain)(tests_utils_1.TEST_CHAIN, '0x000000000000')).rejects.toThrow(Error);
        });
    });
});
//# sourceMappingURL=vaults.utils.spec.js.map