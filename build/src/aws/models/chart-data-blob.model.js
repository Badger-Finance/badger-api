"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartDataBlob = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const sdk_1 = require("@badger-dao/sdk");
const constants_1 = require("../../config/constants");
let ChartDataBlob = class ChartDataBlob {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  ChartDataBlob.prototype,
  "id",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  ChartDataBlob.prototype,
  "timeframe",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: { type: "Any" } }),
    tslib_1.__metadata("design:type", Array)
  ],
  ChartDataBlob.prototype,
  "data",
  void 0
);
ChartDataBlob = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.CHART_DATA)],
  ChartDataBlob
);
exports.ChartDataBlob = ChartDataBlob;
//# sourceMappingURL=chart-data-blob.model.js.map
