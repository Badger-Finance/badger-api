"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentVaultSnapshotModel = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
const vault_strategy_interface_1 = require("../../vaults/interfaces/vault-strategy.interface");
let CurrentVaultSnapshotModel = class CurrentVaultSnapshotModel {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "block",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
  ],
  CurrentVaultSnapshotModel.prototype,
  "timestamp",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  CurrentVaultSnapshotModel.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "available",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "balance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "strategyBalance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "totalSupply",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "pricePerFullShare",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "ratio",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(vault_strategy_interface_1.VaultStrategy)
    }),
    tslib_1.__metadata("design:type", vault_strategy_interface_1.VaultStrategy)
  ],
  CurrentVaultSnapshotModel.prototype,
  "strategy",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "boostWeight",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "value",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "apr",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "yieldApr",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CurrentVaultSnapshotModel.prototype,
  "harvestApr",
  void 0
);
CurrentVaultSnapshotModel = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.VAULT_SNAPSHOTS_DATA)],
  CurrentVaultSnapshotModel
);
exports.CurrentVaultSnapshotModel = CurrentVaultSnapshotModel;
//# sourceMappingURL=current-vault-snapshot.model.js.map
