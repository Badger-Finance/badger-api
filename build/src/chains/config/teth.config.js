"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestEthereum = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const loadTokens_json_1 = tslib_1.__importDefault(
  require("@badger-dao/sdk-mocks/generated/ethereum/api/loadTokens.json")
);
const test_strategy_1 = require("../strategies/test.strategy");
const chain_config_1 = require("./chain.config");
class TestEthereum extends chain_config_1.Chain {
  constructor(provider) {
    super(
      sdk_1.Network.Ethereum,
      loadTokens_json_1.default,
      provider,
      new test_strategy_1.TestStrategy(),
      "0x31825c0a6278b89338970e3eb979b05b27faa263"
    );
    chain_config_1.Chain.register(this.network, this);
  }
}
exports.TestEthereum = TestEthereum;
//# sourceMappingURL=teth.config.js.map
