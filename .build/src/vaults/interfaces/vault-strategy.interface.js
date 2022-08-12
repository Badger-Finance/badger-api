"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultStrategy = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class VaultStrategy {
}
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], VaultStrategy.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultStrategy.prototype, "withdrawFee", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultStrategy.prototype, "performanceFee", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultStrategy.prototype, "strategistFee", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], VaultStrategy.prototype, "aumFee", void 0);
exports.VaultStrategy = VaultStrategy;
//# sourceMappingURL=vault-strategy.interface.js.map