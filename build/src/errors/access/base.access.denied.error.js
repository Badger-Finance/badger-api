"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDeniedError = void 0;
const base_error_1 = require("../base.error");
const network_status_enum_1 = require("../enums/network-status.enum");
class AccessDeniedError extends base_error_1.BaseApiError {
    constructor(message, code) {
        super(message || 'Access to resource denied', code, network_status_enum_1.NetworkStatus.Forbidden);
    }
}
exports.AccessDeniedError = AccessDeniedError;
//# sourceMappingURL=base.access.denied.error.js.map