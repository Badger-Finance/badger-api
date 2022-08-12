"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricVaultSnapshotOldModel = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const vault_strategy_interface_1 = require("../../vaults/interfaces/vault-strategy.interface");
// deprecated
let HistoricVaultSnapshotOldModel = class HistoricVaultSnapshotOldModel {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "block", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.rangeKey)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], HistoricVaultSnapshotOldModel.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "available", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "balance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "strategyBalance", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "totalSupply", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "pricePerFullShare", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "ratio", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: (0, dynamodb_data_mapper_1.embed)(vault_strategy_interface_1.VaultStrategy) }),
    tslib_1.__metadata("design:type", vault_strategy_interface_1.VaultStrategy)
], HistoricVaultSnapshotOldModel.prototype, "strategy", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "boostWeight", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "value", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "apr", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "yieldApr", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], HistoricVaultSnapshotOldModel.prototype, "harvestApr", void 0);
HistoricVaultSnapshotOldModel = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.SETT_HISTORIC_DATA)
], HistoricVaultSnapshotOldModel);
exports.HistoricVaultSnapshotOldModel = HistoricVaultSnapshotOldModel;
//# sourceMappingURL=historic-vault-snapshot-old.model.js.map