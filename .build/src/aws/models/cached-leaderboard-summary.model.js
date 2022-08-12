"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedLeaderboardSummary = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const leaderboard_rank_summary_interface_1 = require("../../leaderboards/interface/leaderboard-rank-summary.interface");
let CachedLeaderboardSummary = class CachedLeaderboardSummary {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], CachedLeaderboardSummary.prototype, "leaderboard", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: (0, dynamodb_data_mapper_1.embed)(leaderboard_rank_summary_interface_1.LeaderboardRankSummary) }),
    tslib_1.__metadata("design:type", Array)
], CachedLeaderboardSummary.prototype, "rankSummaries", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], CachedLeaderboardSummary.prototype, "updatedAt", void 0);
CachedLeaderboardSummary = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.LEADERBOARD_SUMMARY_DATA)
], CachedLeaderboardSummary);
exports.CachedLeaderboardSummary = CachedLeaderboardSummary;
//# sourceMappingURL=cached-leaderboard-summary.model.js.map