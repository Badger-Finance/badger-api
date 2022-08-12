"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidAddrError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const base_validation_error_1 = require("./base.validation.error");
class InvalidAddrError extends base_validation_error_1.ValidationError {
    constructor(addr) {
        super(`Addr ${addr} is not a valid account`, error_codes_enum_1.ApiErrorCode.InvalidAddress);
    }
}
exports.InvalidAddrError = InvalidAddrError;
//# sourceMappingURL=invalid.addr.error.js.map