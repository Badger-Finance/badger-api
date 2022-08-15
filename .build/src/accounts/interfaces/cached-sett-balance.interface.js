"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CachedSettBalance = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_1 = require("@aws/dynamodb-data-mapper");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const cached_token_balance_interface_1 = require("../../tokens/interfaces/cached-token-balance.interface");
class CachedSettBalance {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedSettBalance.prototype,
  "network",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedSettBalance.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedSettBalance.prototype,
  "name",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  CachedSettBalance.prototype,
  "symbol",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "pricePerFullShare",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "balance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "value",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  CachedSettBalance.prototype,
  "tokens",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "earnedBalance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "earnedValue",
  void 0
);
tslib_1.__decorate(
  [
    (0, dynamodb_data_mapper_annotations_1.attribute)({
      memberType: (0, dynamodb_data_mapper_1.embed)(cached_token_balance_interface_1.CachedTokenBalance)
    }),
    tslib_1.__metadata("design:type", Array)
  ],
  CachedSettBalance.prototype,
  "earnedTokens",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "depositedBalance",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  CachedSettBalance.prototype,
  "withdrawnBalance",
  void 0
);
exports.CachedSettBalance = CachedSettBalance;
//# sourceMappingURL=cached-sett-balance.interface.js.map
