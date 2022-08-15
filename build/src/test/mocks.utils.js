"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockQueryResults = exports.mockBalance = exports.setupMockChain = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const sdk_1 = tslib_1.__importStar(require("@badger-dao/sdk"));
const jest_create_mock_instance_1 = tslib_1.__importDefault(require("jest-create-mock-instance"));
const jest_mock_extended_1 = require("jest-mock-extended");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const teth_config_1 = require("../chains/config/teth.config");
const chain_vaults_1 = require("../chains/vaults/chain.vaults");
const chartsUtils = tslib_1.__importStar(require("../charts/charts.utils"));
const pricesUtils = tslib_1.__importStar(require("../prices/prices.utils"));
const constants_1 = require("./constants");
function setupMockChain() {
  jest.spyOn(pricesUtils, "queryPrice").mockImplementation(async (token, _currency) => ({
    address: token,
    price: parseInt(token.slice(0, 5), 16),
    updatedAt: Date.now()
  }));
  jest.spyOn(pricesUtils, "convert").mockImplementation(async (price, currency) => {
    if (!currency || currency === sdk_1.Currency.USD) {
      return price;
    }
    return price / 2;
  });
  jest
    .spyOn(chain_vaults_1.ChainVaults.prototype, "getVault")
    .mockImplementation(async (_) => constants_1.MOCK_VAULT_DEFINITION);
  jest
    .spyOn(chain_vaults_1.ChainVaults.prototype, "all")
    .mockImplementation(async () => [constants_1.MOCK_VAULT_DEFINITION]);
  const mockSigner = (0, jest_mock_extended_1.mock)();
  mockSigner.getAddress.calledWith().mockImplementation(async () => constants_1.TEST_ADDR);
  const mockProvider = (0, jest_mock_extended_1.mock)();
  mockProvider.getSigner.calledWith().mockImplementation(() => mockSigner);
  mockProvider.getBlockNumber.calledWith().mockImplementation(async () => constants_1.TEST_CURRENT_BLOCK);
  const mockMulticall = (0, jest_mock_extended_1.mock)();
  mockMulticall.getBlockNumber.calledWith().mockImplementation(async () => constants_1.TEST_CURRENT_BLOCK);
  jest.spyOn(sdk_1.default.prototype, "getMulticallProvider").mockImplementation((_p) => mockMulticall);
  jest.spyOn(sdk_1.RegistryService.prototype, "ready").mockImplementation();
  jest.spyOn(sdk_1.RewardsService.prototype, "ready").mockImplementation();
  jest.spyOn(teth_config_1.TestEthereum.prototype, "getGasPrices").mockImplementation(async () => ({
    rapid: { maxFeePerGas: 223.06, maxPriorityFeePerGas: 3.04 },
    fast: { maxFeePerGas: 221.96, maxPriorityFeePerGas: 1.94 },
    standard: { maxFeePerGas: 221.91, maxPriorityFeePerGas: 1.89 },
    slow: { maxFeePerGas: 221.81, maxPriorityFeePerGas: 1.79 }
  }));
  const chain = new teth_config_1.TestEthereum(mockProvider);
  // setup vault charts for the mock vault
  jest.spyOn(chartsUtils, "queryVaultCharts").mockImplementation(async (_k) =>
    constants_1.MOCK_VAULT_SNAPSHOTS.slice(0, 4).map((snapshot) => {
      const historicSnapshot = Object.assign(new historic_vault_snapshot_model_1.HistoricVaultSnapshotModel(), {
        ...snapshot,
        id: (0, dynamodb_utils_1.getVaultEntityId)(chain, constants_1.MOCK_VAULT_SNAPSHOT),
        timestamp: constants_1.TEST_CURRENT_TIMESTAMP
      });
      return historicSnapshot;
    })
  );
  return chain;
}
exports.setupMockChain = setupMockChain;
function mockBalance(token, balance, currency) {
  let price = parseInt(token.address.slice(0, 5), 16);
  if (currency && currency !== sdk_1.Currency.USD) {
    price /= 2;
  }
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price
  };
}
exports.mockBalance = mockBalance;
function mockQueryResults(items, filter) {
  // @ts-ignore
  const qi = (0, jest_create_mock_instance_1.default)(dynamodb_data_mapper_1.QueryIterator);
  let result = items;
  if (filter) {
    result = filter(items);
  }
  // @ts-ignore
  qi[Symbol.iterator] = jest.fn(() => result.values());
  return jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, "query").mockImplementation(() => qi);
}
exports.mockQueryResults = mockQueryResults;
//# sourceMappingURL=mocks.utils.js.map
