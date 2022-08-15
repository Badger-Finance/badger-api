"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const tokens_config_1 = require("../../config/tokens.config");
const polygon_tokens_config_1 = require("../../tokens/config/polygon-tokens.config");
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class Polygon extends chain_config_1.Chain {
  constructor() {
    super(
      sdk_1.Network.Polygon,
      polygon_tokens_config_1.maticTokensConfig,
      rpc_config_1.default[sdk_1.Network.Polygon],
      new base_strategy_1.BaseStrategy(sdk_1.Network.Polygon, Object.keys(polygon_tokens_config_1.maticTokensConfig))
    );
    chain_config_1.Chain.register(this.network, this);
  }
  getBadgerTokenAddress() {
    return tokens_config_1.TOKENS.MATIC_BADGER;
  }
}
exports.Polygon = Polygon;
//# sourceMappingURL=polygon.config.js.map
