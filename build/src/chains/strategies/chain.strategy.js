"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainStrategy = void 0;
const exceptions_1 = require("@tsed/exceptions");
const ethers_1 = require("ethers");
const tokens_utils_1 = require("../../tokens/tokens.utils");
class ChainStrategy {
    static register(strategy, addresses) {
        for (const address of addresses) {
            ChainStrategy.strategies[ethers_1.ethers.utils.getAddress(address)] = strategy;
        }
    }
    static async getStrategy(chain, address) {
        const token = await (0, tokens_utils_1.getFullToken)(chain, address);
        const strategy = this.strategies[token.address];
        if (!strategy) {
            throw new exceptions_1.BadRequest(`Token (${token.address}) not supported for pricing`);
        }
        return strategy;
    }
}
exports.ChainStrategy = ChainStrategy;
ChainStrategy.strategies = {};
//# sourceMappingURL=chain.strategy.js.map