"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiError = void 0;
class BaseApiError extends Error {
  constructor(message, code, status) {
    super(message);
    this.message = message;
    this.code = code;
    this.status = status;
  }
  toString() {
    return `${this.message}; \n Api Code: ${this.code}; \n Network Status ${this.status}`;
  }
}
exports.BaseApiError = BaseApiError;
//# sourceMappingURL=base.error.js.map
