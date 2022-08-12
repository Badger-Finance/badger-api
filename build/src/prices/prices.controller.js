"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PriceController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const price_summary_model_interface_1 = require("../tokens/interfaces/price-summary-model.interface");
const prices_service_1 = require("./prices.service");
let PriceController = class PriceController {
    async listPrices(tokens, chain, currency) {
        var _a;
        return this.pricesService.getPriceSummary((_a = tokens === null || tokens === void 0 ? void 0 : tokens.split(',')) !== null && _a !== void 0 ? _a : Object.keys(chain_config_1.Chain.getChain(chain).tokens), currency);
    }
    async getPriceSnapshots(tokens, timestamps, currency) {
        return this.pricesService.getPriceSnapshots(tokens.split(','), timestamps.split(',').map((t) => Number(t)), currency);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", prices_service_1.PricesService)
], PriceController.prototype, "pricesService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)(''),
    (0, common_1.UseCache)(),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a summary of token prices related to the Badger Protocol'),
    (0, schema_1.Description)('Return a map of checksum contract address to the currency value of the token'),
    (0, schema_1.Returns)(200, price_summary_model_interface_1.PriceSummaryModel),
    tslib_1.__param(0, (0, common_1.QueryParams)('tokens')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(2, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PriceController.prototype, "listPrices", null);
tslib_1.__decorate([
    (0, common_1.Get)('/snapshots'),
    (0, schema_1.Hidden)(),
    (0, common_1.UseCache)(),
    (0, schema_1.ContentType)('json'),
    tslib_1.__param(0, (0, common_1.QueryParams)('tokens')),
    tslib_1.__param(1, (0, common_1.QueryParams)('timestamps')),
    tslib_1.__param(2, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PriceController.prototype, "getPriceSnapshots", null);
PriceController = tslib_1.__decorate([
    (0, common_1.Controller)('/prices')
], PriceController);
exports.PriceController = PriceController;
//# sourceMappingURL=prices.controller.js.map