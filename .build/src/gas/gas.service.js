"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const gas_utils_1 = require("./gas.utils");
let GasService = class GasService {
  /**
   * Attempt to retrieve the prices for a chain from the cache
   * if no value is in the cache, refresh prices for all chains
   * @param chain Gas price chain
   * @returns object of gas speeds and prices
   */
  async getGasPrices(chain) {
    const gasCache = await (0, gas_utils_1.getGasCache)();
    return gasCache[chain.network];
  }
};
GasService = tslib_1.__decorate([(0, common_1.Service)()], GasService);
exports.GasService = GasService;
//# sourceMappingURL=gas.service.js.map
