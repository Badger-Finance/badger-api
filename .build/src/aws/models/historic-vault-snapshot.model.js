"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HistoricVaultSnapshotModel = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const chart_data_model_1 = require("../../charts/chart-data.model");
const vault_strategy_interface_1 = require("../../vaults/interfaces/vault-strategy.interface");
class HistoricVaultSnapshotModel extends chart_data_model_1.ChartData {
  toBlankData() {
    const copy = JSON.parse(JSON.stringify(this));
    copy.block = 0;
    copy.available = 0;
    copy.balance = 0;
    copy.strategyBalance = 0;
    copy.totalSupply = 0;
    copy.pricePerFullShare = 0;
    copy.totalSupply = 0;
    copy.ratio = 0;
    copy.boostWeight = 0;
    copy.value = 0;
    copy.balance = 0;
    copy.apr = 0;
    copy.yieldApr = 0;
    copy.harvestApr = 0;
    copy.strategy = {};
    return copy;
  }
}
HistoricVaultSnapshotModel.NAMESPACE = "vault";
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  HistoricVaultSnapshotModel.prototype,
  "id",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  HistoricVaultSnapshotModel.prototype,
  "chain",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  HistoricVaultSnapshotModel.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "timestamp",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "block",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "available",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "balance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "strategyBalance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "totalSupply",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "pricePerFullShare",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
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
  HistoricVaultSnapshotModel.prototype,
  "strategy",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "boostWeight",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "value",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "apr",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "yieldApr",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  HistoricVaultSnapshotModel.prototype,
  "harvestApr",
  void 0
);
exports.HistoricVaultSnapshotModel = HistoricVaultSnapshotModel;
//# sourceMappingURL=historic-vault-snapshot.model.js.map
