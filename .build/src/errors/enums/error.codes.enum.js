"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiErrorCode = void 0;
var ApiErrorCode;
(function (ApiErrorCode) {
    // Validation Errors
    ApiErrorCode[ApiErrorCode["QueryParamInvalid"] = 1000] = "QueryParamInvalid";
    ApiErrorCode[ApiErrorCode["InvalidAddress"] = 1001] = "InvalidAddress";
    ApiErrorCode[ApiErrorCode["UnsupportedChain"] = 1002] = "UnsupportedChain";
    // Allocation Errors
    ApiErrorCode[ApiErrorCode["NoDataForChain"] = 2000] = "NoDataForChain";
    ApiErrorCode[ApiErrorCode["NoDataForAddress"] = 2001] = "NoDataForAddress";
    ApiErrorCode[ApiErrorCode["NoDataForVault"] = 2002] = "NoDataForVault";
    ApiErrorCode[ApiErrorCode["UnknownVault"] = 2100] = "UnknownVault";
    // Access Errors
    ApiErrorCode[ApiErrorCode["AccessDeniedDevModeOnly"] = 3000] = "AccessDeniedDevModeOnly";
    // Citadel Errors
    ApiErrorCode[ApiErrorCode["NoDataInBouncerList"] = 9000] = "NoDataInBouncerList";
})(ApiErrorCode = exports.ApiErrorCode || (exports.ApiErrorCode = {}));
//# sourceMappingURL=error.codes.enum.js.map