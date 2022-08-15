"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinanceSmartChain = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const tokens_config_1 = require("../../config/tokens.config");
const bsc_tokens_config_1 = require("../../tokens/config/bsc-tokens.config");
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class BinanceSmartChain extends chain_config_1.Chain {
  constructor() {
    super(
      sdk_1.Network.BinanceSmartChain,
      bsc_tokens_config_1.bscTokensConfig,
      rpc_config_1.default[sdk_1.Network.BinanceSmartChain],
      new base_strategy_1.BaseStrategy(
        sdk_1.Network.BinanceSmartChain,
        Object.keys(bsc_tokens_config_1.bscTokensConfig)
      )
    );
    chain_config_1.Chain.register(this.network, this);
  }
  getBadgerTokenAddress() {
    return tokens_config_1.TOKENS.MULTI_BADGER;
  }
}
exports.BinanceSmartChain = BinanceSmartChain;
//# sourceMappingURL=bsc.config.js.map
