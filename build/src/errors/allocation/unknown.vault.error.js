"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownVaultError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const not_found_error_1 = require("./not.found.error");
class UnknownVaultError extends not_found_error_1.NotFoundError {
    constructor(vault) {
        super(`Unknown vault address: ${vault}`, error_codes_enum_1.ApiErrorCode.UnknownVault);
    }
}
exports.UnknownVaultError = UnknownVaultError;
//# sourceMappingURL=unknown.vault.error.js.map