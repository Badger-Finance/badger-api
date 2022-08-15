"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const accountsUtils = tslib_1.__importStar(require("../accounts/accounts.utils"));
const tokens_config_1 = require("../config/tokens.config");
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokenUtils = tslib_1.__importStar(require("../tokens/tokens.utils"));
const vaultUtils = tslib_1.__importStar(require("../vaults/vaults.utils"));
const metrics_utils_1 = require("./metrics.utils");
describe("metrics.utils", () => {
  beforeEach(() => {
    (0, tests_utils_1.mockChainVaults)();
    jest
      .spyOn(accountsUtils, "getAccounts")
      .mockReturnValue(
        Promise.resolve([
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000001",
          "0x0000000000000000000000000000000000000002",
          "0x0000000000000000000000000000000000000003",
          "0x0000000000000000000000000000000000000004",
          "0x0000000000000000000000000000000000000005",
          "0x0000000000000000000000000000000000000006"
        ])
      );
    jest.spyOn(tokenUtils, "getFullToken").mockImplementation(async (_, tokenAddr) => {
      return (
        full_token_mock_1.fullTokenMockMap[tokenAddr] ||
        full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER]
      );
    });
    jest
      .spyOn(vaultUtils, "getCachedVault")
      .mockImplementation(async (chain, VaultDefinition) => vaultUtils.defaultVault(chain, VaultDefinition));
  });
  describe("getProtocolUsersMetric", () => {
    it("returns total users", async () => {
      const totalUsers = await (0, metrics_utils_1.getProtocolTotalUsers)();
      expect(totalUsers).toMatchSnapshot();
    });
  });
  describe("getSettsMetrics", () => {
    it("returns setts metrics", async () => {
      const metrics = await (0, metrics_utils_1.getProtocolSettMetrics)();
      expect(metrics).toMatchSnapshot();
    });
  });
  describe("getProtocolMetrics", () => {
    it("returns protocolMetrics", async () => {
      const metrics = await (0, metrics_utils_1.getProtocolMetrics)();
      expect(metrics).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=metrics.utils.spec.js.map
