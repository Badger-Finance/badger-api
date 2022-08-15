"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasPricesModel = void 0;
const tslib_1 = require("tslib");
const schema_1 = require("@tsed/schema");
/**
 * Mapping of speed selections to gas pricing
 */
let GasPricesModel = class GasPricesModel {};
GasPricesModel = tslib_1.__decorate(
  [
    (0, schema_1.Description)("Mapping of speed selections to gas pricing"),
    (0, schema_1.Example)({
      rapid: { maxFeePerGas: 175, maxPriorityFeePerGas: 2.5 },
      fast: { maxFeePerGas: 174, maxPriorityFeePerGas: 2.0 },
      standard: { maxFeePerGas: 172, maxPriorityFeePerGas: 1.5 },
      slow: { maxFeePerGas: 172, maxPriorityFeePerGas: 1.0 }
    })
  ],
  GasPricesModel
);
exports.GasPricesModel = GasPricesModel;
//# sourceMappingURL=gas-prices-model.js.map
