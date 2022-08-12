"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MigrationProcessData = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const migration_enums_1 = require("../../migrations/migration.enums");
// Helper table for different kinds of migrations,
// persists the process of running migration state
class MigrationSequence {
}
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], MigrationSequence.prototype, "name", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], MigrationSequence.prototype, "value", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", typeof (_a = typeof migration_enums_1.MigrationStatus !== "undefined" && migration_enums_1.MigrationStatus) === "function" ? _a : Object)
], MigrationSequence.prototype, "status", void 0);
let MigrationProcessData = class MigrationProcessData {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], MigrationProcessData.prototype, "id", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], MigrationProcessData.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", typeof (_b = typeof migration_enums_1.MigrationStatus !== "undefined" && migration_enums_1.MigrationStatus) === "function" ? _b : Object)
], MigrationProcessData.prototype, "status", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: (0, dynamodb_data_mapper_1.embed)(MigrationSequence) }),
    tslib_1.__metadata("design:type", Array)
], MigrationProcessData.prototype, "sequences", void 0);
MigrationProcessData = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.MIGRATION_PROCESS_DATA)
], MigrationProcessData);
exports.MigrationProcessData = MigrationProcessData;
//# sourceMappingURL=migration-process.model.js.map