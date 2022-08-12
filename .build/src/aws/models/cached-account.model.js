"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedAccount = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const cached_sett_balance_interface_1 = require("../../accounts/interfaces/cached-sett-balance.interface");
const constants_1 = require("../../config/constants");
let CachedAccount = class CachedAccount {
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], CachedAccount.prototype, "address", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: (0, dynamodb_data_mapper_1.embed)(cached_sett_balance_interface_1.CachedSettBalance) }),
    tslib_1.__metadata("design:type", Array)
], CachedAccount.prototype, "balances", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
], CachedAccount.prototype, "updatedAt", void 0);
CachedAccount = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.ACCOUNT_DATA)
], CachedAccount);
exports.CachedAccount = CachedAccount;
//# sourceMappingURL=cached-account.model.js.map