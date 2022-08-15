"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const yield_source_model_1 = require("../aws/models/yield-source.model");
const rewardsUtils = tslib_1.__importStar(require("../rewards/rewards.utils"));
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const apy_snapshots_indexer_1 = require("./apy-snapshots-indexer");
describe("apy-snapshots-indexer", () => {
  const mockValueSource = Object.assign(new yield_source_model_1.YieldSource(), {
    addressValueSourceType: "0xfd05D3C7fe2924020620A8bE4961bBaA747e6305_flat_CVX_emission",
    address: "0xfd05D3C7fe2924020620A8bE4961bBaA747e6305",
    type: "flat_CVX_emission",
    apr: 1,
    name: "CVX Rewards",
    oneDay: 1,
    threeDay: 1,
    sevenDay: 1,
    thirtyDay: 1,
    harvestable: false,
    minApr: 1,
    maxApr: 1,
    boostable: false
  });
  const mockInvalidValueSource = Object.assign(new yield_source_model_1.YieldSource(), {
    addressValueSourceType: null,
    address: null,
    type: null,
    apr: NaN,
    name: null,
    harvestable: false,
    minApr: null,
    maxApr: null,
    boostable: false
  });
  beforeEach(() => {
    (0, tests_utils_1.mockBatchDelete)([mockValueSource]);
    (0, tests_utils_1.setupMapper)([mockValueSource]);
    (0, tests_utils_1.mockChainVaults)();
  });
  describe("refreshChainApySnapshots", () => {
    it("calls batchPut for valid value source", async () => {
      const batchPut = (0, tests_utils_1.mockBatchPut)([mockValueSource]);
      jest.spyOn(rewardsUtils, "getVaultValueSources").mockReturnValue(Promise.resolve([mockValueSource]));
      (0, tests_utils_1.setupMapper)([mockValueSource]);
      await (0, apy_snapshots_indexer_1.refreshChainApySnapshots)(
        tests_utils_1.TEST_CHAIN,
        constants_1.MOCK_VAULT_DEFINITION
      );
      expect(batchPut.mock.calls[0][0]).toEqual([mockValueSource]);
      // Make sure was called for each sett in the chain
      const allChainVault = await tests_utils_1.TEST_CHAIN.vaults.all();
      expect(batchPut.mock.calls.length).toEqual(allChainVault.length);
    });
    it("doesnt call batch put if value source invalid", async () => {
      const batchPut = (0, tests_utils_1.mockBatchPut)([mockInvalidValueSource]);
      jest.spyOn(rewardsUtils, "getVaultValueSources").mockReturnValue(Promise.resolve([mockInvalidValueSource]));
      await (0, apy_snapshots_indexer_1.refreshChainApySnapshots)(
        tests_utils_1.TEST_CHAIN,
        constants_1.MOCK_VAULT_DEFINITION
      );
      expect(batchPut.mock.calls).toEqual([]);
    });
  });
});
//# sourceMappingURL=apy-snapshots-indexer.spec.js.map
