"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Optimism = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const rpc_config_1 = tslib_1.__importDefault(require("../../config/rpc.config"));
const base_strategy_1 = require("../strategies/base.strategy");
const chain_config_1 = require("./chain.config");
class Optimism extends chain_config_1.Chain {
    constructor() {
        super(sdk_1.Network.Optimism, {}, rpc_config_1.default[sdk_1.Network.Optimism], new base_strategy_1.BaseStrategy(sdk_1.Network.Optimism, Object.keys({})));
        chain_config_1.Chain.register(this.network, this);
    }
}
exports.Optimism = Optimism;
//# sourceMappingURL=optimism.config.js.map