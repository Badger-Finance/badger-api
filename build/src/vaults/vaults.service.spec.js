"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const tokens_config_1 = require("../config/tokens.config");
const pricesUtils = tslib_1.__importStar(require("../prices/prices.utils"));
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokenUtils = tslib_1.__importStar(require("../tokens/tokens.utils"));
const vaults_service_1 = require("./vaults.service");
const vaultsUtils = tslib_1.__importStar(require("./vaults.utils"));
describe("proofs.service", () => {
  let service;
  beforeAll(async () => {
    await common_1.PlatformTest.create();
    service = common_1.PlatformTest.get(vaults_service_1.VaultsService);
  });
  beforeEach(() => {
    (0, tests_utils_1.mockChainVaults)();
    jest.spyOn(tokenUtils, "getFullToken").mockImplementation(async (_, tokenAddr) => {
      return (
        full_token_mock_1.fullTokenMockMap[tokenAddr] ||
        full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER]
      );
    });
    jest.spyOn(vaultsUtils, "getCachedVault").mockImplementation(async (chain, vault) => {
      const cachedVault = await vaultsUtils.defaultVault(chain, vault);
      cachedVault.value = Number(vault.address.slice(0, 6));
      cachedVault.balance = Number(vault.address.slice(0, 3));
      return cachedVault;
    });
    // TODO: implement pricing fixtures for test suites
    jest.spyOn(pricesUtils, "convert").mockImplementation(async (price, currency) => {
      if (currency === sdk_1.Currency.USD) {
        return price;
      }
      return (price * 8) / 3;
    });
  });
  afterEach(common_1.PlatformTest.reset);
  describe("getProtocolSummary", () => {
    describe("request with no currency", () => {
      it("returns the protocol summary in usd base currency", async () => {
        const result = await service.getProtocolSummary(tests_utils_1.TEST_CHAIN);
        expect(result).toMatchSnapshot();
      });
    });
    describe("request with currency", () => {
      it("returns the protocol summary in requested base currency", async () => {
        const result = await service.getProtocolSummary(tests_utils_1.TEST_CHAIN, sdk_1.Currency.AVAX);
        expect(result).toMatchSnapshot();
      });
    });
  });
});
//# sourceMappingURL=vaults.service.spec.js.map
