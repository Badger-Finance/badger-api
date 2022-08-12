"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultDefinitionModel = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const sdk_1 = require("@badger-dao/sdk");
const constants_1 = require("../../config/constants");
const stage_enum_1 = require("../../config/enums/stage.enum");
let VaultDefinitionModel = class VaultDefinitionModel {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "id", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultDefinitionModel.prototype, "createdAt", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        indexKeyConfigurations: {
            IndexVaultCompoundDataChain: 'HASH',
            IndexVaultCompoundDataChainIsProd: 'HASH',
        },
    }),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "chain", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({
        indexKeyConfigurations: {
            IndexVaultCompoundDataChainIsProd: 'RANGE',
        },
    }),
    tslib_1.__metadata("design:type", Number)
], VaultDefinitionModel.prototype, "isProduction", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "name", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "bouncer", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "stage", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "version", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "state", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "protocol", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "behavior", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "client", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultDefinitionModel.prototype, "depositToken", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultDefinitionModel.prototype, "updatedAt", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultDefinitionModel.prototype, "releasedAt", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Boolean)
], VaultDefinitionModel.prototype, "isNew", void 0);
VaultDefinitionModel = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.VAULT_DEFINITION_DATA)
], VaultDefinitionModel);
exports.VaultDefinitionModel = VaultDefinitionModel;
//# sourceMappingURL=vault-definition.model.js.map