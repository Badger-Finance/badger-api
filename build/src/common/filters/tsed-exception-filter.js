"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsedExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const core_1 = require("@tsed/core");
const exceptions_1 = require("@tsed/exceptions");
// Deprecated, plz consider using ApiExceptionFilter
let TsedExceptionFilter = class TsedExceptionFilter {
  catch(error, ctx) {
    const { response } = ctx;
    let exception = new exceptions_1.InternalServerError("Internal server error");
    // Unfortunately, TSED HTTP Exceptions do not extend the HTTPException
    // type, so we cannot check `error instanceof HttpException`. This is a
    // bit jank, but if `status` is defined, we use the thrown error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error.status) {
      exception = error;
    }
    const { message, status } = exception;
    const body = {
      message
    };
    let exceptionResponse = exception.body;
    if ((0, core_1.isString)(exceptionResponse)) {
      body.message = exceptionResponse;
    } else if ((0, core_1.isObject)(exceptionResponse)) {
      exceptionResponse = exceptionResponse;
      if (exceptionResponse.errors) {
        body.errors = exceptionResponse.errors;
      }
    }
    response.status(status).body(body);
  }
};
TsedExceptionFilter = tslib_1.__decorate([(0, common_1.Catch)(exceptions_1.Exception)], TsedExceptionFilter);
exports.TsedExceptionFilter = TsedExceptionFilter;
//# sourceMappingURL=tsed-exception-filter.js.map
