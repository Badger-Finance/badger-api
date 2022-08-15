"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaimableBalance = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class ClaimableBalance {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  ClaimableBalance.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  ClaimableBalance.prototype,
  "balance",
  void 0
);
exports.ClaimableBalance = ClaimableBalance;
//# sourceMappingURL=claimable-balance.js.map
