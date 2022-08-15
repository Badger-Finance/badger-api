"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const s3Utils = tslib_1.__importStar(require("../aws/s3.utils"));
const bsc_config_1 = require("../chains/config/bsc.config");
const eth_config_1 = require("../chains/config/eth.config");
const constants_1 = require("../test/constants");
const rewards_utils_1 = require("./rewards.utils");
describe("rewards.utils", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(jest.fn);
  });
  describe("getTreeDistribution", () => {
    it("returns null for a chain with no badger tree", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation(async () => {
        throw new Error("Expected test error, missing Badger Tree file.");
      });
      const distribution = await (0, rewards_utils_1.getTreeDistribution)(new bsc_config_1.BinanceSmartChain());
      expect(distribution).toEqual(null);
    });
    it("returns the distribution file for the requested chain", async () => {
      jest
        .spyOn(s3Utils, "getObject")
        .mockImplementation(async () => JSON.stringify(constants_1.MOCK_DISTRIBUTION_FILE));
      const distribution = await (0, rewards_utils_1.getTreeDistribution)(new eth_config_1.Ethereum());
      expect(distribution).toEqual(constants_1.MOCK_DISTRIBUTION_FILE);
    });
  });
});
//# sourceMappingURL=rewards.utils.spec.js.map
