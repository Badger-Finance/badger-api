"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestStrategy = void 0;
const tokens_config_1 = require("../../config/tokens.config");
const chain_strategy_1 = require("./chain.strategy");
class TestStrategy extends chain_strategy_1.ChainStrategy {
    constructor() {
        super();
        chain_strategy_1.ChainStrategy.register(this, Object.values(tokens_config_1.TOKENS));
    }
    async getPrice(address) {
        const price = parseInt(address.slice(0, 6), 16);
        return { address, price };
    }
    randomPrice(min, max) {
        const minPrice = min || 10;
        const maxPrice = max || 50000;
        return minPrice + Math.random() * (maxPrice - minPrice);
    }
}
exports.TestStrategy = TestStrategy;
//# sourceMappingURL=test.strategy.js.map