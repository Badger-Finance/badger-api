"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YieldSource = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const sdk_1 = require("@badger-dao/sdk");
const constants_1 = require("../../config/constants");
const source_type_enum_1 = require("../../rewards/enums/source-type.enum");
let YieldSource = class YieldSource {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "id", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        indexKeyConfigurations: {
            IndexApySnapshotsOnAddress: 'HASH',
        },
    }),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "chainAddress", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "chain", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "type", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], YieldSource.prototype, "name", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], YieldSource.prototype, "apr", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Boolean)
], YieldSource.prototype, "boostable", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], YieldSource.prototype, "minApr", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], YieldSource.prototype, "maxApr", void 0);
YieldSource = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.YIELD_SNAPSHOTS_DATA)
], YieldSource);
exports.YieldSource = YieldSource;
//# sourceMappingURL=yield-source.model.js.map