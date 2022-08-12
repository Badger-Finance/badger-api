"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodataForVaultError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const not_found_error_1 = require("./not.found.error");
class NodataForVaultError extends not_found_error_1.NotFoundError {
    constructor(vault) {
        super(`Vault ${vault} doest have any data`, error_codes_enum_1.ApiErrorCode.NoDataForVault);
    }
}
exports.NodataForVaultError = NodataForVaultError;
//# sourceMappingURL=nodata.for.vault.error.js.map