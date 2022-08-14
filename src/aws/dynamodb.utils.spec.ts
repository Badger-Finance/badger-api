import { Network } from "@badger-dao/sdk";

import { getChainStartBlockKey } from "./dynamodb.utils";

describe("dynamodb.utils", () => {
  describe("getChainStartBlockKey", () => {
    it("returns underscore delimited string comprised of chain network and requested block", () => {
      expect(getChainStartBlockKey(Network.Ethereum, 13500000)).toEqual(`ethereum_13500000`);
    });
  });
});
