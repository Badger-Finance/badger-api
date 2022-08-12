"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MOCK_YIELD_SOURCES = exports.MOCK_VAULT_SNAPSHOT = exports.MOCK_VAULT_SNAPSHOTS = exports.MOCK_VAULT = exports.MOCK_VAULTS = exports.MOCK_VAULT_DEFINITION = exports.MOCK_BOUNCER_FILE = exports.MOCK_DISTRIBUTION_FILE = exports.TEST_CURRENT_TIMESTAMP = exports.TEST_ADDR = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const loadVaultChart_json_1 = tslib_1.__importDefault(require("@badger-dao/sdk-mocks/generated/ethereum/api/loadVaultChart.json"));
const loadVaults_json_1 = tslib_1.__importDefault(require("@badger-dao/sdk-mocks/generated/ethereum/api/loadVaults.json"));
const stage_enum_1 = require("../config/enums/stage.enum");
const tokens_config_1 = require("../config/tokens.config");
exports.TEST_ADDR = tokens_config_1.TOKENS.BBADGER;
exports.TEST_CURRENT_TIMESTAMP = 1660223160457;
exports.MOCK_DISTRIBUTION_FILE = {
    merkleRoot: exports.TEST_ADDR,
    cycle: 4034,
    tokenTotal: {
        [tokens_config_1.TOKENS.BADGER]: 10,
        [tokens_config_1.TOKENS.DIGG]: 3,
    },
    claims: {
        [exports.TEST_ADDR]: {
            index: '0x01',
            cycle: '0x01',
            user: exports.TEST_ADDR,
            tokens: [tokens_config_1.TOKENS.BADGER, tokens_config_1.TOKENS.DIGG],
            cumulativeAmounts: ['4', '1'],
            proof: [exports.TEST_ADDR, exports.TEST_ADDR, exports.TEST_ADDR],
            node: exports.TEST_ADDR,
        },
    },
};
exports.MOCK_BOUNCER_FILE = {
    merkleRoot: exports.TEST_ADDR,
    tokenTotal: 5,
    claims: {
        [exports.TEST_ADDR]: {
            index: '0x01',
            amount: 1,
            proof: [exports.TEST_ADDR, exports.TEST_ADDR, exports.TEST_ADDR],
        },
    },
};
exports.MOCK_VAULT_DEFINITION = {
    id: `${sdk_1.Network.Ethereum}-${tokens_config_1.TOKENS.BBADGER}`,
    address: exports.TEST_ADDR,
    name: 'Badger',
    createdAt: 0,
    updatedAt: 0,
    releasedAt: 0,
    stage: stage_enum_1.Stage.Production,
    behavior: sdk_1.VaultBehavior.Compounder,
    state: sdk_1.VaultState.Open,
    protocol: sdk_1.Protocol.Badger,
    isProduction: 1,
    bouncer: sdk_1.BouncerType.None,
    chain: sdk_1.Network.Ethereum,
    isNew: false,
    version: sdk_1.VaultVersion.v1,
    client: '',
    depositToken: tokens_config_1.TOKENS.BADGER,
};
exports.MOCK_VAULTS = loadVaults_json_1.default;
exports.MOCK_VAULT = exports.MOCK_VAULTS[0];
exports.MOCK_VAULT_SNAPSHOTS = loadVaultChart_json_1.default;
exports.MOCK_VAULT_SNAPSHOT = exports.MOCK_VAULT_SNAPSHOTS[0];
exports.MOCK_YIELD_SOURCES = exports.MOCK_VAULT.sources;
//# sourceMappingURL=constants.js.map