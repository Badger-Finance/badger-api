"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartData = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class ChartData {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  ChartData.prototype,
  "id",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  ChartData.prototype,
  "timestamp",
  void 0
);
exports.ChartData = ChartData;
//# sourceMappingURL=chart-data.model.js.map
