"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGasCache = void 0;
const tslib_1 = require("tslib");
const node_cache_1 = tslib_1.__importDefault(require("node-cache"));
const chain_1 = require("../chains/chain");
const gasCache = new node_cache_1.default({ stdTTL: 15, checkperiod: 17 });
async function getGasCache() {
    const cachedGasPrices = gasCache.get('gasPrices');
    if (cachedGasPrices) {
        return cachedGasPrices;
    }
    const chainGasPrices = await Promise.all(chain_1.SUPPORTED_CHAINS.map(async (c) => [c.network, await c.getGasPrices()]));
    const gasPrices = Object.fromEntries(chainGasPrices);
    gasCache.set('gasPrices', gasPrices);
    return gasPrices;
}
exports.getGasCache = getGasCache;
//# sourceMappingURL=gas.utils.js.map