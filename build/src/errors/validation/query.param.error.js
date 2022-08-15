"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueryParamError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const base_validation_error_1 = require("./base.validation.error");
class QueryParamError extends base_validation_error_1.ValidationError {
  constructor(param) {
    super(`Query param ${param} invalid`, error_codes_enum_1.ApiErrorCode.QueryParamInvalid);
  }
}
exports.QueryParamError = QueryParamError;
//# sourceMappingURL=query.param.error.js.map
