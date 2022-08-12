"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiExceptionFilter = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const base_error_1 = require("../../errors/base.error");
let ApiExceptionFilter = class ApiExceptionFilter {
    catch(error, ctx) {
        const { response } = ctx;
        const { message, status, code } = error;
        response.status(status).body({
            message,
            code,
        });
    }
};
ApiExceptionFilter = tslib_1.__decorate([
    (0, common_1.Catch)(base_error_1.BaseApiError)
], ApiExceptionFilter);
exports.ApiExceptionFilter = ApiExceptionFilter;
//# sourceMappingURL=api-exception-filter.js.map