"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenPriceSnapshot = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let TokenPriceSnapshot = class TokenPriceSnapshot {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  TokenPriceSnapshot.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  TokenPriceSnapshot.prototype,
  "price",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.rangeKey)({ defaultProvider: () => Date.now() }),
    tslib_1.__metadata("design:type", Number)
  ],
  TokenPriceSnapshot.prototype,
  "updatedAt",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  TokenPriceSnapshot.prototype,
  "usd",
  void 0
);
TokenPriceSnapshot = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.TOKEN_PRICE_DATA)],
  TokenPriceSnapshot
);
exports.TokenPriceSnapshot = TokenPriceSnapshot;
//# sourceMappingURL=token-price-snapshot.model.js.map
