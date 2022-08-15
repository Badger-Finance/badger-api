"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceSummaryModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
const tokens_config_1 = require("../../config/tokens.config");
/**
 * Mapping from token contract address to single
 * currency price data.
 */
let PriceSummaryModel = class PriceSummaryModel {};
PriceSummaryModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Mapping of checksum contract address to currency value"),
    (0, schema_1.Example)({
      [tokens_config_1.TOKENS.BADGER]: 10.34,
      [tokens_config_1.TOKENS.DIGG]: 41003.56,
      [tokens_config_1.TOKENS.XSUSHI]: 13.52,
      [tokens_config_1.TOKENS.WBTC]: 39023.12
    })
  ],
  PriceSummaryModel
);
exports.PriceSummaryModel = PriceSummaryModel;
//# sourceMappingURL=price-summary-model.interface.js.map
