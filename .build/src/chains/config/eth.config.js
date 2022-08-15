"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ethereum = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const eth_tokens_config_1 = require("../../tokens/config/eth-tokens.config");
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class Ethereum extends chain_config_1.Chain {
  constructor() {
    super(
      sdk_1.Network.Ethereum,
      eth_tokens_config_1.ethTokensConfig,
      rpc_config_1.default[sdk_1.Network.Ethereum],
      new base_strategy_1.BaseStrategy(sdk_1.Network.Ethereum, Object.keys(eth_tokens_config_1.ethTokensConfig)),
      "0x31825c0a6278b89338970e3eb979b05b27faa263"
    );
    chain_config_1.Chain.register(this.network, this);
  }
}
exports.Ethereum = Ethereum;
//# sourceMappingURL=eth.config.js.map
