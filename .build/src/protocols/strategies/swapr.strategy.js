"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwaprStrategy = void 0;
const constants_1 = require("../../config/constants");
const strategy_utils_1 = require("./strategy.utils");
class SwaprStrategy {
    static async getValueSources(_chain, vaultDefinition) {
        return Promise.all([(0, strategy_utils_1.getUniV2SwapValue)(constants_1.SWAPR_URL, vaultDefinition)]);
    }
}
exports.SwaprStrategy = SwaprStrategy;
//# sourceMappingURL=swapr.strategy.js.map