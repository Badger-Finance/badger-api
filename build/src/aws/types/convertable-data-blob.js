"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConvertableDataBlob = void 0;
const keyed_data_blob_model_1 = require("../models/keyed-data-blob.model");
class ConvertableDataBlob {
    constructor(blob) {
        this.blob = blob;
        this.keyedBlob = Object.assign(new keyed_data_blob_model_1.KeyedDataBlob(), {
            id: this.id(),
            data: blob,
        });
    }
}
exports.ConvertableDataBlob = ConvertableDataBlob;
//# sourceMappingURL=convertable-data-blob.js.map