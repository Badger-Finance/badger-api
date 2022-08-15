"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuickswapStrategy = void 0;
const constants_1 = require("../../config/constants");
const strategy_utils_1 = require("./strategy.utils");
class QuickswapStrategy {
  static async getValueSources(vault) {
    return Promise.all([(0, strategy_utils_1.getUniV2SwapValue)(constants_1.QUICKSWAP_URL, vault)]);
  }
}
exports.QuickswapStrategy = QuickswapStrategy;
//# sourceMappingURL=quickswap.strategy.js.map
