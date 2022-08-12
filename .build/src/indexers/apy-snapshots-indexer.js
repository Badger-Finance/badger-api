"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshChainApySnapshots = exports.refreshApySnapshots = void 0;
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const chain_1 = require("../chains/chain");
const rewards_utils_1 = require("../rewards/rewards.utils");
const vaults_utils_1 = require("../vaults/vaults.utils");
async function refreshApySnapshots() {
    for (const chain of chain_1.SUPPORTED_CHAINS) {
        const vaults = await chain.vaults.all();
        await Promise.all(vaults.map(async (vault) => refreshChainApySnapshots(chain, vault)));
    }
    return 'done';
}
exports.refreshApySnapshots = refreshApySnapshots;
async function refreshChainApySnapshots(chain, vault) {
    try {
        const reportedYieldSources = await (0, rewards_utils_1.getVaultValueSources)(chain, vault);
        const currentYieldSources = reportedYieldSources.filter((s) => !isNaN(s.apr) && isFinite(s.apr));
        const currentApr = currentYieldSources.reduce((total, s) => (total += s.apr), 0);
        const previousYieldSources = await (0, vaults_utils_1.queryYieldSources)(vault);
        const previousApr = previousYieldSources.reduce((total, s) => (total += s.apr), 0);
        if (currentYieldSources.length === 0 || currentApr === 0) {
            return;
        }
        if (Math.abs(currentApr - previousApr) > previousApr * 0.3) {
            // TODO: add discord webhook message alert here
        }
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        // check for any emission removal
        const previousSourcesMap = {};
        previousYieldSources.forEach((source) => (previousSourcesMap[source.id] = source));
        // remove updated sources from old source list
        currentYieldSources.forEach((source) => delete previousSourcesMap[source.id]);
        const prunedPreviousYieldSources = Object.values(previousSourcesMap);
        try {
            if (prunedPreviousYieldSources.length > 0) {
                for await (const _item of mapper.batchDelete(prunedPreviousYieldSources)) {
                }
            }
            if (currentYieldSources.length > 0) {
                for await (const _item of mapper.batchPut(currentYieldSources)) {
                }
            }
        }
        catch (err) {
            console.log({ err, currentYieldSources, prunedPreviousYieldSources, vault });
        }
    }
    catch (err) {
        console.error({ err, message: `${chain.network} failed to update APY snapshots for vaults` });
    }
}
exports.refreshChainApySnapshots = refreshChainApySnapshots;
//# sourceMappingURL=apy-snapshots-indexer.js.map