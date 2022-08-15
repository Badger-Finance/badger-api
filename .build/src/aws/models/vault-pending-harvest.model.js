"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultPendingHarvestData = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const cached_token_balance_interface_1 = require("../../tokens/interfaces/cached-token-balance.interface");
let VaultPendingHarvestData = class VaultPendingHarvestData {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  VaultPendingHarvestData.prototype,
  "vault",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultPendingHarvestData.prototype,
  "yieldTokens",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultPendingHarvestData.prototype,
  "harvestTokens",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultPendingHarvestData.prototype,
  "previousYieldTokens",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  VaultPendingHarvestData.prototype,
  "previousHarvestTokens",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Number.MAX_SAFE_INTEGER }),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultPendingHarvestData.prototype,
  "duration",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => 0 }),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultPendingHarvestData.prototype,
  "lastMeasuredAt",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => 0 }),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultPendingHarvestData.prototype,
  "lastHarvestedAt",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => 0 }),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultPendingHarvestData.prototype,
  "lastReportedAt",
  void 0
);
VaultPendingHarvestData = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.HARVEST_DATA)],
  VaultPendingHarvestData
);
exports.VaultPendingHarvestData = VaultPendingHarvestData;
//# sourceMappingURL=vault-pending-harvest.model.js.map
