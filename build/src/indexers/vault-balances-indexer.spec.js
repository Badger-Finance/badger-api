"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const eth_config_1 = require("../chains/config/eth.config");
const constants_1 = require("../test/constants");
const tests_utils_1 = require("../test/tests.utils");
const vault_balances_indexer_1 = require("./vault-balances-indexer");
describe("vault-balances-indexer", () => {
  const chain = new eth_config_1.Ethereum();
  let put;
  beforeEach(() => {
    (0, tests_utils_1.mockChainVaults)();
    (0, tests_utils_1.setFullTokenDataMock)();
    (0, tests_utils_1.setupMapper)([(0, tests_utils_1.randomSnapshot)(constants_1.MOCK_VAULT_DEFINITION)]);
    put = jest.spyOn(dynamodb_data_mapper_1.DataMapper.prototype, "put").mockImplementation();
  });
  describe("updateVaultTokenBalances", () => {
    it("should update token with balance", async () => {
      await (0, vault_balances_indexer_1.updateVaultTokenBalances)(chain, constants_1.MOCK_VAULT_DEFINITION);
      expect(put.mock.calls.length).toEqual(1);
    });
  });
});
//# sourceMappingURL=vault-balances-indexer.spec.js.map
