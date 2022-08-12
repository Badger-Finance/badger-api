"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserClaimMetadata = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let UserClaimMetadata = class UserClaimMetadata {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], UserClaimMetadata.prototype, "chainStartBlock", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        indexKeyConfigurations: {
            IndexMetadataChainAndStartBlock: 'RANGE',
        },
    }),
    tslib_1.__metadata("design:type", Number)
], UserClaimMetadata.prototype, "startBlock", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)({
        indexKeyConfigurations: {
            IndexMetadataChainAndStartBlock: 'HASH',
        },
    }),
    tslib_1.__metadata("design:type", String)
], UserClaimMetadata.prototype, "chain", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], UserClaimMetadata.prototype, "endBlock", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], UserClaimMetadata.prototype, "cycle", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], UserClaimMetadata.prototype, "count", void 0);
UserClaimMetadata = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.USER_CLAIMED_METADATA)
], UserClaimMetadata);
exports.UserClaimMetadata = UserClaimMetadata;
//# sourceMappingURL=user-claim-metadata.js.map