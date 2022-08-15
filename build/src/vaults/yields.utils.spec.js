"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const tokens_config_1 = require("../config/tokens.config");
const source_type_enum_1 = require("../rewards/enums/source-type.enum");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const full_token_mock_1 = require("../tokens/mocks/full-token.mock");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_utils_1 = require("./vaults.utils");
const yields_utils_1 = require("./yields.utils");
describe("yields.utils", () => {
  const baseMockSources = [
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.PreCompound,
      vaults_utils_1.VAULT_SOURCE,
      7
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Compound,
      vaults_utils_1.VAULT_SOURCE,
      11
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.TradeFee,
      "LP Fees",
      2
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Emission,
      "Badger",
      4
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Emission,
      "Boosted Badger",
      6,
      { min: 0.5, max: 2 }
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Flywheel,
      "Vault Flywheel",
      5
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Distribution,
      "Badger",
      3
    ),
    (0, yields_utils_1.createYieldSource)(
      constants_1.MOCK_VAULT_DEFINITION,
      source_type_enum_1.SourceType.Distribution,
      "Irrelevant",
      0.0001
    )
  ];
  describe("calculateYield", () => {
    it.each([
      [365, 1, sdk_1.ONE_DAY_MS, 0, 100],
      [365, 0.5, sdk_1.ONE_DAY_MS, 0, 50],
      [365, 2, sdk_1.ONE_DAY_MS, 0, 200],
      [365, 1, sdk_1.ONE_DAY_MS, 1, 171.45674820219733],
      [365, 1, sdk_1.ONE_DAY_MS, 0.5, 114.81572517391494],
      [0, 1, sdk_1.ONE_DAY_MS, 0, 0]
    ])(
      "%d earned %d over %d ms with %d compounded, for %d apr",
      (principal, earned, duration, compoundingValue, expected) => {
        expect((0, yields_utils_1.calculateYield)(principal, earned, duration, compoundingValue)).toEqual(expected);
      }
    );
    it("throws an error when provided with invalid principal and compounding pair", () => {
      expect(() => (0, yields_utils_1.calculateYield)(365, 1, sdk_1.ONE_DAY_MS, 2)).toThrow(
        "Compounding value must be less than or equal to earned"
      );
    });
  });
  describe("calculateBalanceDifference", () => {
    it("returns an array with the difference in token amounts", () => {
      const badger = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.BADGER];
      const wbtc = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC];
      const listA = [(0, tokens_utils_1.mockBalance)(badger, 10), (0, tokens_utils_1.mockBalance)(wbtc, 2)];
      const listB = [(0, tokens_utils_1.mockBalance)(badger, 25), (0, tokens_utils_1.mockBalance)(wbtc, 5)];
      expect((0, yields_utils_1.calculateBalanceDifference)(listA, listB)).toMatchObject([
        (0, tokens_utils_1.mockBalance)(badger, 15),
        (0, tokens_utils_1.mockBalance)(wbtc, 3)
      ]);
    });
  });
  describe("getYieldSources", () => {
    it("returns vault yield sources categorized by required breakdown", async () => {
      (0, tests_utils_1.setupMapper)(baseMockSources);
      const yieldSources = await (0, yields_utils_1.getYieldSources)(constants_1.MOCK_VAULT_DEFINITION);
      expect(yieldSources).toMatchSnapshot();
    });
    it("returns only passive yield sources for a discontinued vault", async () => {
      const mockSources = [
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.PreCompound,
          vaults_utils_1.VAULT_SOURCE,
          7
        ),
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.Compound,
          vaults_utils_1.VAULT_SOURCE,
          11
        ),
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.TradeFee,
          "LP Fees",
          2
        ),
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.Flywheel,
          "Vault Flywheel",
          5
        ),
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.Distribution,
          "Badger",
          3
        ),
        (0, yields_utils_1.createYieldSource)(
          constants_1.MOCK_VAULT_DEFINITION,
          source_type_enum_1.SourceType.Distribution,
          "Irrelevant",
          0.0001
        )
      ];
      (0, tests_utils_1.setupMapper)(mockSources);
      const definitionCopy = JSON.parse(JSON.stringify(constants_1.MOCK_VAULT_DEFINITION));
      definitionCopy.state = sdk_1.VaultState.Discontinued;
      const yieldSources = await (0, yields_utils_1.getYieldSources)(definitionCopy);
      expect(yieldSources).toMatchSnapshot();
    });
  });
  describe("getVaultYieldProjection", () => {
    it("returns a yield projection estimation from given inputs", async () => {
      const mockDefinition = JSON.parse(JSON.stringify(constants_1.MOCK_VAULT_DEFINITION));
      mockDefinition.address = constants_1.MOCK_VAULT.vaultToken;
      (0, tests_utils_1.setupMapper)(baseMockSources);
      jest.spyOn(Date, "now").mockImplementation(() => referenceTime);
      const yieldSources = await (0, yields_utils_1.getYieldSources)(mockDefinition);
      const referenceTime = 1660071985202;
      const wbtc = full_token_mock_1.fullTokenMockMap[tokens_config_1.TOKENS.WBTC];
      const mockVault = JSON.parse(JSON.stringify(constants_1.MOCK_VAULT));
      mockVault.lastHarvest = referenceTime - sdk_1.ONE_DAY_MS * 30;
      const mockYieldEstimate = {
        vault: constants_1.MOCK_VAULT.vaultToken,
        yieldTokens: [(0, tokens_utils_1.mockBalance)(wbtc, 0.0092)],
        harvestTokens: [(0, tokens_utils_1.mockBalance)(wbtc, 0.0091)],
        previousYieldTokens: [(0, tokens_utils_1.mockBalance)(wbtc, 0.0048)],
        previousHarvestTokens: [(0, tokens_utils_1.mockBalance)(wbtc, 0.0047)],
        duration: sdk_1.ONE_DAY_MS * 15,
        lastMeasuredAt: referenceTime - sdk_1.ONE_DAY_MS * 15,
        lastReportedAt: 0,
        lastHarvestedAt: referenceTime - sdk_1.ONE_DAY_MS * 30
      };
      const result = (0, yields_utils_1.getVaultYieldProjection)(mockVault, yieldSources, mockYieldEstimate);
      expect(result).toMatchSnapshot();
    });
  });
});
//# sourceMappingURL=yields.utils.spec.js.map
