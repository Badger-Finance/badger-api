"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolMetricModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
class ProtocolMetricModel {
  constructor(protocolMetrics) {
    this.totalUsers = protocolMetrics.totalUsers;
    this.totalVaults = protocolMetrics.totalVaults;
    this.totalValueLocked = protocolMetrics.totalValueLocked;
  }
}
tslib_1.__decorate(
  [
    (0, schema_1.Title)("totalUsers"),
    (0, schema_1.Description)("Total amount of users of the protocol"),
    (0, schema_1.Example)(30000),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  ProtocolMetricModel.prototype,
  "totalUsers",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("totalVaults"),
    (0, schema_1.Description)("Total amount of vaults available in the protocol across all chains"),
    (0, schema_1.Example)(30),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  ProtocolMetricModel.prototype,
  "totalVaults",
  void 0
);
tslib_1.__decorate(
  [
    (0, schema_1.Title)("totalValueLocked"),
    (0, schema_1.Description)("Total value locked across all chains"),
    (0, schema_1.Example)(800000000),
    (0, schema_1.Property)(),
    tslib_1.__metadata("design:type", Number)
  ],
  ProtocolMetricModel.prototype,
  "totalValueLocked",
  void 0
);
exports.ProtocolMetricModel = ProtocolMetricModel;
//# sourceMappingURL=protocol-metric-model.js.map
