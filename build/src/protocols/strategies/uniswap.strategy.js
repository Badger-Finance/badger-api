"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapStrategy = void 0;
const constants_1 = require("../../config/constants");
const strategy_utils_1 = require("./strategy.utils");
class UniswapStrategy {
  static async getValueSources(vault) {
    return Promise.all([(0, strategy_utils_1.getUniV2SwapValue)(constants_1.UNISWAP_URL, vault)]);
  }
}
exports.UniswapStrategy = UniswapStrategy;
//# sourceMappingURL=uniswap.strategy.js.map
