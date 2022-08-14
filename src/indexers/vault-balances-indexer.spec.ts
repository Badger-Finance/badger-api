import { DataMapper, PutParameters, StringToAnyObjectMap } from "@aws/dynamodb-data-mapper";

import { Chain } from "../chains/config/chain.config";
import { MOCK_VAULT_DEFINITION } from "../test/constants";
import { mockQuery, setupMockChain } from "../test/mocks.utils";
import { randomSnapshot } from "../test/tests.utils";
import { updateVaultTokenBalances } from "./vault-balances-indexer";

describe("vault-balances-indexer", () => {
  let chain: Chain;
  let put: jest.SpyInstance<Promise<StringToAnyObjectMap>, [parameters: PutParameters]>;

  beforeEach(() => {
    chain = setupMockChain();
    mockQuery([randomSnapshot(MOCK_VAULT_DEFINITION)]);
    put = jest.spyOn(DataMapper.prototype, "put").mockImplementation();
  });

  describe("updateVaultTokenBalances", () => {
    it("should update token with balance", async () => {
      await updateVaultTokenBalances(chain, MOCK_VAULT_DEFINITION);
      expect(put.mock.calls.length).toEqual(1);
    });
  });
});
