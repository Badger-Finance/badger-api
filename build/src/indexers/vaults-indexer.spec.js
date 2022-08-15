"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const chain_1 = require("../chains/chain");
const chartUtils = tslib_1.__importStar(require("../charts/charts.utils"));
const tokens_config_1 = require("../config/tokens.config");
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokenUtils = tslib_1.__importStar(require("../tokens/tokens.utils"));
const vaults_service_1 = require("../vaults/vaults.service");
const vaults_utils_1 = require("../vaults/vaults.utils");
const indexerUtils = tslib_1.__importStar(require("./indexer.utils"));
const vaults_indexer_1 = require("./vaults-indexer");
describe("vaults-indexer", () => {
  let vaultToSnapshot;
  beforeEach(() => {
    (0, tests_utils_1.mockChainVaults)();
    vaultToSnapshot = jest
      .spyOn(indexerUtils, "vaultToSnapshot")
      .mockImplementation(async (_chain, vault) => (0, tests_utils_1.randomSnapshot)(vault));
    jest
      .spyOn(vaults_service_1.VaultsService, "loadVault")
      .mockImplementation(async (c, v) => (0, vaults_utils_1.defaultVault)(c, v));
    jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, "put").mockImplementation();
    // just mock, to prevent dramatic amount of console output
    // will be refactored, when old vault historic data be removed
    jest.spyOn(chartUtils, "updateSnapshots").mockImplementation();
  });
  describe("indexProtocolVaults", () => {
    it("should call update price for all tokens", async () => {
      jest.spyOn(tokenUtils, "getFullToken").mockImplementation(async (_, tokenAddr) => {
        return (
          full_token_mock_1.fullTokenMockMap[tokenAddr] ||
          full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER]
        );
      });
      await (0, vaults_indexer_1.indexProtocolVaults)();
      expect(vaultToSnapshot.mock.calls.length).toEqual(chain_1.SUPPORTED_CHAINS.length);
    });
  });
});
//# sourceMappingURL=vaults-indexer.spec.js.map
