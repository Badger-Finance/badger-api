"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const base_error_1 = require("../base.error");
const network_status_enum_1 = require("../enums/network-status.enum");
class NotFoundError extends base_error_1.BaseApiError {
    constructor(message, code) {
        super(message || 'NotFound', code, network_status_enum_1.NetworkStatus.NotFound);
    }
}
exports.NotFoundError = NotFoundError;
//# sourceMappingURL=not.found.error.js.map