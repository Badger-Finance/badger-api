"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GasController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const gas_service_1 = require("./gas.service");
const gas_prices_model_1 = require("./interfaces/gas-prices-model");
let GasController = class GasController {
  async getGasPrices(chain) {
    return this.gasService.getGasPrices(chain_config_1.Chain.getChain(chain));
  }
};
tslib_1.__decorate(
  [(0, common_1.Inject)(), tslib_1.__metadata("design:type", gas_service_1.GasService)],
  GasController.prototype,
  "gasService",
  void 0
);
tslib_1.__decorate(
  [
    (0, common_1.Get)(""),
    (0, schema_1.ContentType)("json"),
    (0, schema_1.Summary)("Get the current gas price"),
    (0, schema_1.Description)("Returns the current gas price on the requested chain"),
    (0, schema_1.Returns)(200, gas_prices_model_1.GasPricesModel),
    (0, schema_1.Returns)(404).Description("Chain gas prices not available"),
    tslib_1.__param(0, (0, common_1.QueryParams)("chain")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
  ],
  GasController.prototype,
  "getGasPrices",
  null
);
GasController = tslib_1.__decorate([(0, common_1.Controller)("/gas")], GasController);
exports.GasController = GasController;
//# sourceMappingURL=gas.controller.js.map
