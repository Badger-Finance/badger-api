"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChainMetrics = exports.getProtocolSettMetrics = exports.getProtocolTotalUsers = exports.getProtocolMetrics = void 0;
const accounts_utils_1 = require("../accounts/accounts.utils");
const chain_1 = require("../chains/chain");
const vaults_utils_1 = require("../vaults/vaults.utils");
const getProtocolMetrics = async () => {
    const [totalUsers, settMetrics] = await Promise.all([getProtocolTotalUsers(), getProtocolSettMetrics()]);
    return { ...settMetrics, totalUsers };
};
exports.getProtocolMetrics = getProtocolMetrics;
async function getProtocolTotalUsers() {
    const usersAcrossChains = await Promise.all(chain_1.SUPPORTED_CHAINS.map((chain) => (0, accounts_utils_1.getAccounts)(chain)));
    return new Set([...usersAcrossChains.flat()]).size;
}
exports.getProtocolTotalUsers = getProtocolTotalUsers;
async function getProtocolSettMetrics() {
    var _a, _b;
    const multichainsSummary = await Promise.all(chain_1.SUPPORTED_CHAINS.map((chain) => getChainMetrics(chain)));
    let totalValueLocked = 0;
    let totalVaults = 0;
    for (const protocolSummary of multichainsSummary) {
        totalValueLocked += protocolSummary.totalValue;
        totalVaults += (_b = (_a = protocolSummary.setts) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
    }
    return { totalValueLocked, totalVaults };
}
exports.getProtocolSettMetrics = getProtocolSettMetrics;
async function getChainMetrics(chain) {
    const vaults = await chain.vaults.all();
    const chainVaults = await Promise.all(vaults.map((vault) => (0, vaults_utils_1.getCachedVault)(chain, vault)));
    const totalValue = chainVaults.reduce((total, vault) => total + vault.value, 0);
    const vaultSummaries = chainVaults.map(({ name, balance, value }) => ({ name, balance, value }));
    return { totalValue, setts: vaultSummaries, vaults: vaultSummaries };
}
exports.getChainMetrics = getChainMetrics;
//# sourceMappingURL=metrics.utils.js.map