"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodataForChainError = void 0;
const error_codes_enum_1 = require("../enums/error.codes.enum");
const not_found_error_1 = require("./not.found.error");
class NodataForChainError extends not_found_error_1.NotFoundError {
  constructor(chain) {
    super(`${chain} does not have requested data`, error_codes_enum_1.ApiErrorCode.NoDataForChain);
  }
}
exports.NodataForChainError = NodataForChainError;
//# sourceMappingURL=nodata.for.chain.error.js.map
