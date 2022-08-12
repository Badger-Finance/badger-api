"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fantom = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const tokens_config_1 = require("../../config/tokens.config");
const fantom_tokens_config_1 = require("../../tokens/config/fantom-tokens.config");
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class Fantom extends chain_config_1.Chain {
    constructor() {
        super(sdk_1.Network.Fantom, fantom_tokens_config_1.fantomTokensConfig, rpc_config_1.default[sdk_1.Network.Fantom], new base_strategy_1.BaseStrategy(sdk_1.Network.Fantom, Object.keys(fantom_tokens_config_1.fantomTokensConfig)), '0x89122c767A5F543e663DB536b603123225bc3823');
        chain_config_1.Chain.register(this.network, this);
    }
    getBadgerTokenAddress() {
        return tokens_config_1.TOKENS.MULTI_BADGER;
    }
}
exports.Fantom = Fantom;
//# sourceMappingURL=fantom.config.js.map