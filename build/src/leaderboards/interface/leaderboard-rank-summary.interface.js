"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeaderboardRankSummary = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class LeaderboardRankSummary {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  LeaderboardRankSummary.prototype,
  "badgerType",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  LeaderboardRankSummary.prototype,
  "amount",
  void 0
);
exports.LeaderboardRankSummary = LeaderboardRankSummary;
//# sourceMappingURL=leaderboard-rank-summary.interface.js.map
