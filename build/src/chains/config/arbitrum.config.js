"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arbitrum = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const tokens_config_1 = require("../../config/tokens.config");
const arbitrum_tokens_config_1 = require("../../tokens/config/arbitrum-tokens.config");
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class Arbitrum extends chain_config_1.Chain {
    constructor() {
        super(sdk_1.Network.Arbitrum, arbitrum_tokens_config_1.arbitrumTokensConfig, rpc_config_1.default[sdk_1.Network.Arbitrum], new base_strategy_1.BaseStrategy(sdk_1.Network.Arbitrum, Object.keys(arbitrum_tokens_config_1.arbitrumTokensConfig)), '0x78418681f9ed228d627f785fb9607ed5175518fd');
        chain_config_1.Chain.register(this.network, this);
    }
    getBadgerTokenAddress() {
        return tokens_config_1.TOKENS.ARB_BADGER;
    }
}
exports.Arbitrum = Arbitrum;
//# sourceMappingURL=arbitrum.config.js.map