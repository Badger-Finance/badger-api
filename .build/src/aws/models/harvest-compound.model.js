"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestCompoundData = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const harvest_enum_1 = require("../../vaults/enums/harvest.enum");
let HarvestCompoundData = class HarvestCompoundData {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], HarvestCompoundData.prototype, "vault", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.rangeKey)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], HarvestCompoundData.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HarvestCompoundData.prototype, "amount", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HarvestCompoundData.prototype, "strategyBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HarvestCompoundData.prototype, "block", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HarvestCompoundData.prototype, "estimatedApr", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], HarvestCompoundData.prototype, "eventType", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], HarvestCompoundData.prototype, "token", void 0);
HarvestCompoundData = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.HARVEST_COMPOUND_DATA)
], HarvestCompoundData);
exports.HarvestCompoundData = HarvestCompoundData;
//# sourceMappingURL=harvest-compound.model.js.map