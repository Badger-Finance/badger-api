"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryLeaderboardSummary = void 0;
const sdk_1 = require("@badger-dao/sdk");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const cached_leaderboard_summary_model_1 = require("../aws/models/cached-leaderboard-summary.model");
async function queryLeaderboardSummary(chain) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for await (const entry of mapper.query(
    cached_leaderboard_summary_model_1.CachedLeaderboardSummary,
    {
      leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain)
    },
    { limit: 1 }
  )) {
    return entry;
  }
  return {
    leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain),
    rankSummaries: [
      {
        badgerType: sdk_1.BadgerType.Basic,
        amount: 0
      },
      {
        badgerType: sdk_1.BadgerType.Neo,
        amount: 0
      },
      {
        badgerType: sdk_1.BadgerType.Hero,
        amount: 0
      },
      {
        badgerType: sdk_1.BadgerType.Hyper,
        amount: 0
      },
      {
        badgerType: sdk_1.BadgerType.Frenzy,
        amount: 0
      }
    ],
    updatedAt: Date.now()
  };
}
exports.queryLeaderboardSummary = queryLeaderboardSummary;
//# sourceMappingURL=leaderboards.utils.js.map
