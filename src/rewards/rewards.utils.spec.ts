import * as s3Utils from "../aws/s3.utils";
import { BinanceSmartChain } from "../chains/config/bsc.config";
import { Ethereum } from "../chains/config/eth.config";
import { MOCK_DISTRIBUTION_FILE } from "../test/constants";
import { getTreeDistribution } from "./rewards.utils";

describe("rewards.utils", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(jest.fn);
  });

  describe("getTreeDistribution", () => {
    it("returns null for a chain with no badger tree", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation(async () => {
        throw new Error("Expected test error, missing Badger Tree file.");
      });
      const distribution = await getTreeDistribution(new BinanceSmartChain());
      expect(distribution).toEqual(null);
    });

    it("returns the distribution file for the requested chain", async () => {
      jest.spyOn(s3Utils, "getObject").mockImplementation(async () => JSON.stringify(MOCK_DISTRIBUTION_FILE));
      const distribution = await getTreeDistribution(new Ethereum());
      expect(distribution).toEqual(MOCK_DISTRIBUTION_FILE);
    });
  });
});
