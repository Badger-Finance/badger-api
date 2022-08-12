"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockBadgerSdk = exports.mockChainVaults = exports.mockPricing = exports.setFullTokenDataMock = exports.setupMockAccounts = exports.randomCachedBoosts = exports.setupChainGasPrices = exports.randomSnapshots = exports.randomSnapshot = exports.randomValue = exports.defaultAccount = exports.setupDdbVaultsChartsData = exports.setupVaultsHistoricDDB = exports.setupVaultsCoumpoundDDB = exports.mockBatchDelete = exports.mockBatchPut = exports.setupBatchGet = exports.setupMapper = exports.mockVaultDTO = exports.CURRENT_BLOCK = exports.TEST_CHAIN = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const tokens_service_1 = require("@badger-dao/sdk/lib/tokens/tokens.service");
const ethers_1 = require("ethers");
const jest_create_mock_instance_1 = tslib_1.__importDefault(require("jest-create-mock-instance"));
const jest_mock_extended_1 = require("jest-mock-extended");
const vault_definition_json_1 = tslib_1.__importDefault(require("../../seed/vault-definition.json"));
const accountsUtils = tslib_1.__importStar(require("../accounts/accounts.utils"));
const dynamodbUtils = tslib_1.__importStar(require("../aws/dynamodb.utils"));
const cached_boost_model_1 = require("../aws/models/cached-boost.model");
const chain_1 = require("../chains/chain");
const arbitrum_config_1 = require("../chains/config/arbitrum.config");
const bsc_config_1 = require("../chains/config/bsc.config");
const eth_config_1 = require("../chains/config/eth.config");
const fantom_config_1 = require("../chains/config/fantom.config");
const polygon_config_1 = require("../chains/config/polygon.config");
const chain_vaults_1 = require("../chains/vaults/chain.vaults");
const leaderboard_type_enum_1 = require("../leaderboards/enums/leaderboard-type.enum");
const pricesUtils = tslib_1.__importStar(require("../prices/prices.utils"));
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const historic_vault_snapshots_mock_1 = require("../vaults/mocks/historic-vault-snapshots.mock");
const vaults_chart_data_mock_1 = require("../vaults/mocks/vaults-chart-data.mock");
const constants_1 = require("./constants");
exports.TEST_CHAIN = chain_1.SUPPORTED_CHAINS[0];
exports.CURRENT_BLOCK = 0;
function mockVaultDTO(address) {
    const vault = constants_1.MOCK_VAULTS.find((v) => v.vaultToken === address);
    if (!vault) {
        throw new Error(`DTO for ${address} does not exist`);
    }
    return vault;
}
exports.mockVaultDTO = mockVaultDTO;
function setupMapper(items, filter) {
    // @ts-ignore
    const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
    let result = items;
    if (filter) {
        result = filter(items);
    }
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => result.values());
    return jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation(() => qi);
}
exports.setupMapper = setupMapper;
function setupBatchGet(items, filter) {
    // @ts-ignore
    const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
    let result = items;
    if (filter) {
        result = filter(items);
    }
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => result.values());
    return jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'batchGet').mockImplementation(() => qi);
}
exports.setupBatchGet = setupBatchGet;
function mockBatchPut(items) {
    // @ts-ignore
    const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => items.values());
    return jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'batchPut').mockImplementation(() => qi);
}
exports.mockBatchPut = mockBatchPut;
function mockBatchDelete(items) {
    // @ts-ignore
    const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => items.values());
    return jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'batchDelete').mockImplementation(() => qi);
}
exports.mockBatchDelete = mockBatchDelete;
function setupVaultsCoumpoundDDB() {
    // @ts-ignore
    jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation((model, keys) => {
        let dataSource = vault_definition_json_1.default;
        // @ts-ignore
        const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
        if (keys.chain)
            dataSource = dataSource.filter((v) => v.chain === keys.chain);
        if (keys.isProduction)
            dataSource = dataSource.filter((v) => v.isProduction === keys.isProduction);
        // @ts-ignore
        qi[Symbol.iterator] = jest.fn(() => dataSource.map((obj) => Object.assign(new model(), obj)).values());
        return qi;
    });
}
exports.setupVaultsCoumpoundDDB = setupVaultsCoumpoundDDB;
function setupVaultsHistoricDDB() {
    // @ts-ignore
    jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation((model, keys) => {
        let dataSource = historic_vault_snapshots_mock_1.historicVaultSnapshotsMock;
        // @ts-ignore
        const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
        if (keys.id) {
            dataSource = dataSource.filter((v) => v.id === keys.id);
        }
        // @ts-ignore
        qi[Symbol.iterator] = jest.fn(() => dataSource.map((obj) => Object.assign(new model(), obj)).values());
        return qi;
    });
}
exports.setupVaultsHistoricDDB = setupVaultsHistoricDDB;
function setupDdbVaultsChartsData() {
    jest.spyOn(sdk_1.default.prototype, 'ready').mockImplementation();
    /* eslint-disable @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, 'query').mockImplementation((_model, _condition) => {
        // @ts-ignore
        const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
        const vaultsChart = vaults_chart_data_mock_1.vaultsChartDataMock.find((val) => val.id);
        // @ts-ignore
        qi[Symbol.iterator] = jest.fn(() => ((!!vaultsChart && [vaultsChart]) || []).values());
        return qi;
    });
    /* eslint-enable @typescript-eslint/ban-ts-comment */
}
exports.setupDdbVaultsChartsData = setupDdbVaultsChartsData;
function defaultAccount(address) {
    return {
        address,
        balances: [],
        updatedAt: 0,
    };
}
exports.defaultAccount = defaultAccount;
const randomValue = (min, max) => {
    const minPrice = min || 10;
    const maxPrice = max || 50000;
    return minPrice + Math.random() * (maxPrice - minPrice);
};
exports.randomValue = randomValue;
function randomSnapshot(vaultDefinition) {
    const vault = vaultDefinition !== null && vaultDefinition !== void 0 ? vaultDefinition : constants_1.MOCK_VAULT_DEFINITION;
    const balance = (0, exports.randomValue)();
    const totalSupply = (0, exports.randomValue)();
    const block = (0, exports.randomValue)();
    const available = (0, exports.randomValue)();
    const pricePerFullShare = balance / totalSupply;
    return {
        block,
        address: vault.address,
        balance,
        strategyBalance: (0, exports.randomValue)(),
        pricePerFullShare,
        value: (0, exports.randomValue)(),
        totalSupply,
        timestamp: Date.now(),
        strategy: {
            address: ethers_1.ethers.constants.AddressZero,
            withdrawFee: 0,
            performanceFee: 0,
            strategistFee: 0,
            aumFee: 0,
        },
        boostWeight: 5100,
        available,
        apr: 8.323,
        yieldApr: 8.4,
        harvestApr: 8.37,
    };
}
exports.randomSnapshot = randomSnapshot;
function randomSnapshots(vaultDefinition, count) {
    const snapshots = [];
    const snapshotCount = count !== null && count !== void 0 ? count : 50;
    const vault = vaultDefinition !== null && vaultDefinition !== void 0 ? vaultDefinition : constants_1.MOCK_VAULT_DEFINITION;
    const currentTimestamp = Date.now();
    const start = currentTimestamp - (currentTimestamp % sdk_1.ONE_DAY_MS);
    for (let i = 0; i < snapshotCount; i++) {
        snapshots.push({
            address: vault.address,
            block: 10000000 - i * 1000,
            timestamp: start - i * sdk_1.ONE_DAY_MS,
            balance: (0, exports.randomValue)(),
            strategyBalance: (0, exports.randomValue)(),
            totalSupply: (0, exports.randomValue)(),
            pricePerFullShare: 3 - i * 0.015,
            value: (0, exports.randomValue)(),
            available: (0, exports.randomValue)(),
            strategy: {
                address: ethers_1.ethers.constants.AddressZero,
                withdrawFee: 50,
                performanceFee: 20,
                strategistFee: 0,
                aumFee: 0,
            },
            boostWeight: 5100,
            apr: 13.254,
            yieldApr: 8.4,
            harvestApr: 8.37,
        });
    }
    return snapshots;
}
exports.randomSnapshots = randomSnapshots;
function setupChainGasPrices() {
    jest.spyOn(eth_config_1.Ethereum.prototype, 'getGasPrices').mockImplementation(async () => ({
        rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
        fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
        standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
        slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 },
    }));
    jest
        .spyOn(bsc_config_1.BinanceSmartChain.prototype, 'getGasPrices')
        .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
    jest
        .spyOn(arbitrum_config_1.Arbitrum.prototype, 'getGasPrices')
        .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
    jest
        .spyOn(polygon_config_1.Polygon.prototype, 'getGasPrices')
        .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
    jest
        .spyOn(fantom_config_1.Fantom.prototype, 'getGasPrices')
        .mockImplementation(async () => ({ rapid: 38, fast: 33, standard: 33, slow: 33 }));
}
exports.setupChainGasPrices = setupChainGasPrices;
function randomCachedBoosts(count) {
    const boosts = [];
    for (let i = 0; i < count; i += 1) {
        const boost = {
            leaderboard: `${sdk_1.Network.Ethereum}_${leaderboard_type_enum_1.LeaderBoardType.BadgerBoost}`,
            boostRank: i + 1,
            address: constants_1.TEST_ADDR,
            boost: 2000 - i * 10,
            nftBalance: 1,
            stakeRatio: 1 - i * 0.01,
            nativeBalance: 100000 / (i + 1),
            nonNativeBalance: 250000 / (i + 1),
            bveCvxBalance: 120 * (i + 1),
            diggBalance: 1.3 * (i + 1),
            updatedAt: 1000,
        };
        boosts.push(Object.assign(new cached_boost_model_1.CachedBoost(), boost));
    }
    return boosts;
}
exports.randomCachedBoosts = randomCachedBoosts;
function setupMockAccounts() {
    jest.spyOn(accountsUtils, 'getClaimableBalanceSnapshot').mockImplementation(async () => ({
        chainStartBlock: dynamodbUtils.getChainStartBlockKey(exports.TEST_CHAIN, 10),
        address: constants_1.TEST_ADDR,
        chain: exports.TEST_CHAIN.network,
        startBlock: 100,
        claimableBalances: [],
        expiresAt: Date.now(),
        pageId: 0,
    }));
    jest.spyOn(accountsUtils, 'getLatestMetadata').mockImplementation(async (chain) => ({
        startBlock: 10,
        endBlock: 15,
        chainStartBlock: dynamodbUtils.getChainStartBlockKey(chain, 10),
        chain: chain.network,
        cycle: 10,
        count: 0,
    }));
}
exports.setupMockAccounts = setupMockAccounts;
function setFullTokenDataMock() {
    const fullTokenObjList = Object.values(full_token_mock_1.fullTokenMockMap);
    setupBatchGet(fullTokenObjList);
    mockBatchPut(fullTokenObjList);
    jest.spyOn(tokens_service_1.TokensService.prototype, 'loadTokens').mockImplementation(async () => full_token_mock_1.fullTokenMockMap);
}
exports.setFullTokenDataMock = setFullTokenDataMock;
function mockPricing() {
    jest.spyOn(pricesUtils, 'getPrice').mockImplementation(async (token, _currency) => ({
        address: token,
        price: parseInt(token.slice(0, 5), 16),
        updatedAt: Date.now(),
    }));
    jest.spyOn(pricesUtils, 'convert').mockImplementation(async (price, currency) => {
        if (!currency || currency === sdk_1.Currency.USD) {
            return price;
        }
        return price / 2;
    });
}
exports.mockPricing = mockPricing;
function mockChainVaults() {
    jest.spyOn(chain_vaults_1.ChainVaults.prototype, 'getVault').mockImplementation(async (_) => constants_1.MOCK_VAULT_DEFINITION);
    jest.spyOn(chain_vaults_1.ChainVaults.prototype, 'all').mockImplementation(async () => [constants_1.MOCK_VAULT_DEFINITION]);
}
exports.mockChainVaults = mockChainVaults;
async function mockBadgerSdk(
// in case u want to skip one param
{ addr = constants_1.TEST_ADDR, network = sdk_1.Network.Ethereum, currBlock = exports.CURRENT_BLOCK, } = {
    // in case u want to skip all params
    addr: constants_1.TEST_ADDR,
    network: sdk_1.Network.Ethereum,
    currBlock: exports.CURRENT_BLOCK,
}) {
    const mockSigner = (0, jest_mock_extended_1.mock)();
    mockSigner.getAddress.calledWith().mockImplementation(async () => addr);
    const mockProvider = (0, jest_mock_extended_1.mock)();
    mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
    mockProvider.getBlockNumber.calledWith().mockImplementation(async () => currBlock);
    // Services that will force contracts connection in sdk constructor
    jest.spyOn(sdk_1.RegistryService.prototype, 'ready').mockImplementation();
    jest.spyOn(sdk_1.RewardsService.prototype, 'ready').mockImplementation();
    return new sdk_1.default({
        network: network,
        provider: mockProvider,
    });
}
exports.mockBadgerSdk = mockBadgerSdk;
//# sourceMappingURL=tests.utils.js.map