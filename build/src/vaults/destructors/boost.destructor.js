"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostDestructor = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
class BoostDestructor {
}
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", String)
], BoostDestructor.prototype, "enabled", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)(),
    tslib_1.__metadata("design:type", Number)
], BoostDestructor.prototype, "weight", void 0);
exports.BoostDestructor = BoostDestructor;
//# sourceMappingURL=boost.destructor.js.map