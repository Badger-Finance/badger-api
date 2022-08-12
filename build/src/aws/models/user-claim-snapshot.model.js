"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClaimSnapshot = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const claimable_balance_1 = require("../../rewards/entities/claimable-balance");
let UserClaimSnapshot = class UserClaimSnapshot {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)({
        indexKeyConfigurations: {
            IndexUnclaimedSnapshotsOnAddressAndChainStartBlock: 'RANGE',
        },
    }),
    tslib_1.__metadata("design:type", String)
], UserClaimSnapshot.prototype, "chainStartBlock", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.rangeKey)({
        indexKeyConfigurations: {
            IndexUnclaimedSnapshotsOnAddressAndChainStartBlock: 'HASH',
        },
    }),
    tslib_1.__metadata("design:type", String)
], UserClaimSnapshot.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], UserClaimSnapshot.prototype, "chain", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], UserClaimSnapshot.prototype, "startBlock", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: (0, dynamodb_data_mapper_1.embed)(claimable_balance_1.ClaimableBalance) }),
    tslib_1.__metadata("design:type", Array)
], UserClaimSnapshot.prototype, "claimableBalances", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], UserClaimSnapshot.prototype, "pageId", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        defaultProvider: () => {
            const today = Date.now() / 1000;
            const expireTime = constants_1.ONE_DAY_SECONDS * (constants_1.PRODUCTION ? 30 : 1);
            return today + expireTime;
        },
    }),
    tslib_1.__metadata("design:type", Number)
], UserClaimSnapshot.prototype, "expiresAt", void 0);
UserClaimSnapshot = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.UNCLAIMED_SNAPSHOTS_DATA)
], UserClaimSnapshot);
exports.UserClaimSnapshot = UserClaimSnapshot;
//# sourceMappingURL=user-claim-snapshot.model.js.map