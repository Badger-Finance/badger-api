"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodataForAddrError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const not_found_error_1 = require("./not.found.error");
class NodataForAddrError extends not_found_error_1.NotFoundError {
    constructor(addr) {
        super(`No data for specified address: ${addr}`, error_codes_enum_1.ApiErrorCode.NoDataForAddress);
    }
}
exports.NodataForAddrError = NodataForAddrError;
//# sourceMappingURL=nodata.for.addr.error.js.map