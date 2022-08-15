"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultHarvestsModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const tokens_config_1 = require("../../config/tokens.config");
const harvest_enum_1 = require("../enums/harvest.enum");
class VaultHarvestsModel {
  constructor({ timestamp, block, token, amount, eventType, strategyBalance, estimatedApr }) {
    this.timestamp = timestamp;
    this.block = block;
    this.token = token;
    this.amount = amount;
    this.eventType = eventType;
    this.strategyBalance = strategyBalance;
    this.estimatedApr = estimatedApr;
  }
}
tslib_1.__decorate(
  [
    (0, schema_1.Title)("timestamp"),
    (0, schema_1.Description)("time of harvest emitted"),
    (0, schema_1.Example)(Date.now()),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultHarvestsModel.prototype,
  "timestamp",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("block"),
    (0, schema_1.Description)("number of proccessed block"),
    (0, schema_1.Example)(344534534),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultHarvestsModel.prototype,
  "block",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("token"),
    (0, schema_1.Description)("addr of harvested token"),
    (0, schema_1.Example)(tokens_config_1.TOKENS.BADGER),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultHarvestsModel.prototype,
  "token",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("amount"),
    (0, schema_1.Description)("amount of harvested token"),
    (0, schema_1.Example)("15.3452"),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultHarvestsModel.prototype,
  "amount",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("eventType"),
    (0, schema_1.Description)("Harvest or TreeDistribution"),
    (0, schema_1.Example)(harvest_enum_1.HarvestType.TreeDistribution),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", String)
  ],
  VaultHarvestsModel.prototype,
  "eventType",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("strategyBalance"),
    (0, schema_1.Description)("balance of strategy on time of harvest"),
    (0, schema_1.Example)(777),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultHarvestsModel.prototype,
  "strategyBalance",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("estimatedApr"),
    (0, schema_1.Description)("Apr for current event"),
    (0, schema_1.Example)(40),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  VaultHarvestsModel.prototype,
  "estimatedApr",
  void 0
);
exports.VaultHarvestsModel = VaultHarvestsModel;
//# sourceMappingURL=vault-harvests-model.interface.js.map
