"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenDestructor = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class TokenDestructor {}
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  TokenDestructor.prototype,
  "address",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  TokenDestructor.prototype,
  "name",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", String)],
  TokenDestructor.prototype,
  "symbol",
  void 0
);
tslib_1.__decorate(
  [(0, dynamodb_data_mapper_annotations_1.attribute)(), tslib_1.__metadata("design:type", Number)],
  TokenDestructor.prototype,
  "decimals",
  void 0
);
exports.TokenDestructor = TokenDestructor;
//# sourceMappingURL=token.destructor.js.map
