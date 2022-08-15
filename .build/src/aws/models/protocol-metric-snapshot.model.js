"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolMetricSnapshot = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let ProtocolMetricSnapshot = class ProtocolMetricSnapshot {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  ProtocolMetricSnapshot.prototype,
  "type",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.rangeKey)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
  ],
  ProtocolMetricSnapshot.prototype,
  "timestamp",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  ProtocolMetricSnapshot.prototype,
  "totalUsers",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  ProtocolMetricSnapshot.prototype,
  "totalVaults",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  ProtocolMetricSnapshot.prototype,
  "totalValueLocked",
  void 0
);
ProtocolMetricSnapshot = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.METRICS_SNAPSHOTS_DATA)],
  ProtocolMetricSnapshot
);
exports.ProtocolMetricSnapshot = ProtocolMetricSnapshot;
//# sourceMappingURL=protocol-metric-snapshot.model.js.map
