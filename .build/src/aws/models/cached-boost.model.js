"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedBoost = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let CachedBoost = class CachedBoost {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)({
        indexKeyConfigurations: {
            IndexLeaderBoardRankOnAddressAndLeaderboard: 'RANGE',
        },
    }),
    tslib_1.__metadata("design:type", String)
], CachedBoost.prototype, "leaderboard", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.rangeKey)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "boostRank", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        indexKeyConfigurations: {
            IndexLeaderBoardRankOnAddressAndLeaderboard: 'HASH',
        },
    }),
    tslib_1.__metadata("design:type", String)
], CachedBoost.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "boost", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "stakeRatio", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "nftBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "bveCvxBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "diggBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "nativeBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "nonNativeBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], CachedBoost.prototype, "updatedAt", void 0);
CachedBoost = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.LEADERBOARD_DATA)
], CachedBoost);
exports.CachedBoost = CachedBoost;
//# sourceMappingURL=cached-boost.model.js.map