"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const leaderboards_utils_1 = require("./leaderboards.utils");
let LeaderBoardsService = class LeaderBoardsService {
  async fetchLeaderboardSummary(chain) {
    const cachedSummary = await (0, leaderboards_utils_1.queryLeaderboardSummary)(chain);
    const summary = Object.fromEntries(cachedSummary.rankSummaries.map((s) => [s.badgerType, s.amount]));
    return {
      summary,
      updatedAt: cachedSummary.updatedAt
    };
  }
};
LeaderBoardsService = tslib_1.__decorate([(0, common_1.Service)()], LeaderBoardsService);
exports.LeaderBoardsService = LeaderBoardsService;
//# sourceMappingURL=leaderboards.service.js.map
