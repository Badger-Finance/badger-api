"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyedDataBlob = void 0;
const tslib_1 = require("tslib");
const dynamodb_data_mapper_annotations_1 = require("@aws/dynamodb-data-mapper-annotations");
const constants_1 = require("../../config/constants");
let KeyedDataBlob = class KeyedDataBlob {
    getProperty(property) {
        let result;
        // When we've added nested objects in Map
        // ddb serialized it as plain js Object
        if (this.data instanceof Map) {
            result = this.data.get(property);
        }
        else {
            result = this.data[property];
        }
        if (result === undefined) {
            throw new Error(`Unable to resolve ${property}`);
        }
        return result;
    }
    getString(property) {
        return this.getProperty(property);
    }
    getNumber(property) {
        return this.getProperty(property);
    }
};
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.hashKey)(),
    tslib_1.__metadata("design:type", String)
], KeyedDataBlob.prototype, "id", void 0);
tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.attribute)({ memberType: { type: 'Any' } }),
    tslib_1.__metadata("design:type", Object)
], KeyedDataBlob.prototype, "data", void 0);
KeyedDataBlob = tslib_1.__decorate([
    (0, dynamodb_data_mapper_annotations_1.table)(constants_1.PROTOCOL_DATA)
], KeyedDataBlob);
exports.KeyedDataBlob = KeyedDataBlob;
//# sourceMappingURL=keyed-data-blob.model.js.map