"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexBoostLeaderBoard = void 0;
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const accounts_utils_1 = require("../accounts/accounts.utils");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const cached_boost_model_1 = require("../aws/models/cached-boost.model");
const cached_leaderboard_summary_model_1 = require("../aws/models/cached-leaderboard-summary.model");
const chain_1 = require("../chains/chain");
const leaderboards_config_1 = require("../leaderboards/leaderboards.config");
const indexBoostLeaderBoard = async () => {
    await Promise.all(chain_1.SUPPORTED_CHAINS.map(async (chain) => {
        const chainResults = await generateChainBoostsLeaderBoard(chain);
        const summary = {
            [sdk_1.BadgerType.Basic]: 0,
            [sdk_1.BadgerType.Neo]: 0,
            [sdk_1.BadgerType.Hero]: 0,
            [sdk_1.BadgerType.Hyper]: 0,
            [sdk_1.BadgerType.Frenzy]: 0,
        };
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        chainResults.forEach((result) => summary[(0, leaderboards_config_1.getBadgerType)(result.boost)]++);
        const rankSummaries = Object.entries(summary).map((e) => ({
            badgerType: e[0],
            amount: e[1],
        }));
        const chainEntries = [];
        for await (const entry of mapper.query(cached_boost_model_1.CachedBoost, { leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain) })) {
            chainEntries.push(entry);
        }
        for await (const _item of mapper.batchDelete(chainEntries)) {
        }
        for await (const _item of mapper.batchPut(chainResults)) {
        }
        await mapper.put(Object.assign(new cached_leaderboard_summary_model_1.CachedLeaderboardSummary(), {
            leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain),
            rankSummaries,
        }));
    }));
    return 'done';
};
exports.indexBoostLeaderBoard = indexBoostLeaderBoard;
async function generateChainBoostsLeaderBoard(chain) {
    try {
        const boostFile = await (0, accounts_utils_1.getBoostFile)(chain);
        if (!boostFile) {
            return [];
        }
        return Object.entries(boostFile.userData)
            .sort((a, b) => {
            const [_a, aData] = a;
            const [_b, bData] = b;
            if (aData.boost === bData.boost) {
                const aRatioBalance = aData.stakeRatio * aData.nativeBalance;
                const bRatioBalance = bData.stakeRatio * bData.nativeBalance;
                return bRatioBalance - aRatioBalance;
            }
            return bData.boost - aData.boost;
        })
            .map((entry, i) => {
            const [address, userBoost] = entry;
            const { boost, stakeRatio, nftBalance, bveCvxBalance, diggBalance, nativeBalance, nonNativeBalance } = userBoost;
            const cachedBoost = {
                leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain),
                boostRank: i + 1,
                address: ethers_1.ethers.utils.getAddress(address),
                boost,
                stakeRatio,
                nftBalance,
                bveCvxBalance,
                diggBalance,
                nativeBalance,
                nonNativeBalance,
                updatedAt: Date.now(),
            };
            return Object.assign(new cached_boost_model_1.CachedBoost(), cachedBoost);
        });
    }
    catch (err) {
        console.log(err);
        return [];
    }
}
//# sourceMappingURL=leaderboard-indexer.js.map