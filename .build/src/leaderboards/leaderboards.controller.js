"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderBoardsController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const leaderboards_service_1 = require("./leaderboards.service");
let LeaderBoardsController = class LeaderBoardsController {
  async getLeaderBoardSummary(chain) {
    return this.leaderBoardsService.fetchLeaderboardSummary(chain_config_1.Chain.getChain(chain));
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", leaderboards_service_1.LeaderBoardsService)],
  LeaderBoardsController.prototype,
  "leaderBoardsService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)(""),
    (0, schema_1.Hidden)(),
    (0, schema_1.ContentType)("json"),
    tslib_1.__param(0, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  LeaderBoardsController.prototype,
  "getLeaderBoardSummary",
  null
);
LeaderBoardsController = tslib_1.__decorate([(0, common_1.Controller)("/leaderboards")], LeaderBoardsController);
exports.LeaderBoardsController = LeaderBoardsController;
//# sourceMappingURL=leaderboards.controller.js.map
