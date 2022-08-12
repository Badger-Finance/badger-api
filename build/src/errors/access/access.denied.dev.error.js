"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedDevError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const base_access_denied_error_1 = require("./base.access.denied.error");
class AccessDeniedDevError extends base_access_denied_error_1.AccessDeniedError {
    constructor(message = '') {
        super(message || 'Access denied', error_codes_enum_1.ApiErrorCode.AccessDeniedDevModeOnly);
    }
}
exports.AccessDeniedDevError = AccessDeniedDevError;
//# sourceMappingURL=access.denied.dev.error.js.map