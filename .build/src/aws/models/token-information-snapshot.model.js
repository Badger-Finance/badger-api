"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenInformationSnapshot = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let TokenInformationSnapshot = class TokenInformationSnapshot {};
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.hashKey)(), tslib_1.__metadata("design:type", String)],
  TokenInformationSnapshot.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  TokenInformationSnapshot.prototype,
  "name",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  TokenInformationSnapshot.prototype,
  "symbol",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  TokenInformationSnapshot.prototype,
  "decimals",
  void 0
);
TokenInformationSnapshot = tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.table)(constants_1.TOKEN_INFORMATION_DATA)],
  TokenInformationSnapshot
);
exports.TokenInformationSnapshot = TokenInformationSnapshot;
//# sourceMappingURL=token-information-snapshot.model.js.map
