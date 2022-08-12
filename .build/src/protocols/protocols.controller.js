"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolController = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const vaults_service_1 = require("../vaults/vaults.service");
const protocol_summary_model_interface_1 = require("./interfaces/protocol-summary-model.interface");
let ProtocolController = class ProtocolController {
    async getAssetsUnderManagement(chain, currency) {
        return this.vaultsService.getProtocolSummary(chain_config_1.Chain.getChain(chain), currency);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", vaults_service_1.VaultsService)
], ProtocolController.prototype, "vaultsService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)('/value'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a summary of protocol metrics'),
    (0, schema_1.Description)('Return a summary of protocol metrics in currency value'),
    (0, schema_1.Returns)(200, protocol_summary_model_interface_1.ProtocolSummaryModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(1, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProtocolController.prototype, "getAssetsUnderManagement", null);
ProtocolController = tslib_1.__decorate([
    (0, common_1.Controller)('/')
], ProtocolController);
exports.ProtocolController = ProtocolController;
//# sourceMappingURL=protocols.controller.js.map