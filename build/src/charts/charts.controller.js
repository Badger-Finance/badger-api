"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartsController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const query_param_error_1 = require("../errors/validation/query.param.error");
const charts_service_1 = require("./charts.service");
let ChartsController = class ChartsController {
    async loadVaultCharts(address, timeframe = sdk_1.ChartTimeFrame.Day, chain) {
        if (!address) {
            throw new query_param_error_1.QueryParamError('address');
        }
        return this.chartsService.loadVaultChartData(address, timeframe, chain_config_1.Chain.getChain(chain));
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", charts_service_1.ChartsService)
], ChartsController.prototype, "chartsService", void 0);
tslib_1.__decorate([
    (0, common_1.UseCache)(),
    (0, common_1.Get)('/vault'),
    (0, schema_1.ContentType)('json'),
    tslib_1.__param(0, (0, common_1.QueryParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('timeframe')),
    tslib_1.__param(2, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ChartsController.prototype, "loadVaultCharts", null);
ChartsController = tslib_1.__decorate([
    (0, common_1.Controller)('/charts')
], ChartsController);
exports.ChartsController = ChartsController;
//# sourceMappingURL=charts.controller.js.map