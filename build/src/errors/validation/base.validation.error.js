"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = void 0;
const base_error_1 = require("../base.error");
const network_status_enum_1 = require("../enums/network-status.enum");
class ValidationError extends base_error_1.BaseApiError {
  constructor(message, code) {
    super(message || "Validation failed", code, network_status_enum_1.NetworkStatus.BadRequest);
  }
}
exports.ValidationError = ValidationError;
//# sourceMappingURL=base.validation.error.js.map
