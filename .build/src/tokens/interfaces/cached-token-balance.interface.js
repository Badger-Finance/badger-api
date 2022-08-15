"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedTokenBalance = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class CachedTokenBalance {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedTokenBalance.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedTokenBalance.prototype,
  "name",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedTokenBalance.prototype,
  "symbol",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedTokenBalance.prototype,
  "decimals",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedTokenBalance.prototype,
  "balance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedTokenBalance.prototype,
  "value",
  void 0
);
exports.CachedTokenBalance = CachedTokenBalance;
//# sourceMappingURL=cached-token-balance.interface.js.map
