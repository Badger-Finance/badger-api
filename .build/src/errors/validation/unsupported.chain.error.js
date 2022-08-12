"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedChainError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const base_validation_error_1 = require("./base.validation.error");
class UnsupportedChainError extends base_validation_error_1.ValidationError {
    constructor(chain) {
        super(`${chain} is not supportable for request`, error_codes_enum_1.ApiErrorCode.UnsupportedChain);
    }
}
exports.UnsupportedChainError = UnsupportedChainError;
//# sourceMappingURL=unsupported.chain.error.js.map