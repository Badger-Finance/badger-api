"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettsV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const vault_model_interface_1 = require("./interfaces/vault-model.interface");
const vaults_service_1 = require("./vaults.service");
let SettsV2Controller = class SettsV2Controller {
    async listSetts(chain, currency) {
        return this.vaultsService.listVaults(chain_config_1.Chain.getChain(chain), currency);
    }
    async getSett(vault, chain, currency) {
        const chainInst = chain_config_1.Chain.getChain(chain);
        const vaultDef = await chainInst.vaults.getVault(vault);
        return vaults_service_1.VaultsService.loadVault(chainInst, vaultDef, currency);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", vaults_service_1.VaultsService)
], SettsV2Controller.prototype, "vaultsService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a list of protocol setts'),
    (0, schema_1.Description)('Return a list of protocol setts for the requested chain'),
    (0, schema_1.Returns)(200, vault_model_interface_1.VaultModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    (0, schema_1.Returns)(404).Description('Not a valid sett'),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(1, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettsV2Controller.prototype, "listSetts", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:vault'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a specific sett'),
    (0, schema_1.Description)('Return a specific sett for the requested chain'),
    (0, schema_1.Returns)(200, vault_model_interface_1.VaultModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    (0, schema_1.Returns)(404).Description('Not a valid sett'),
    tslib_1.__param(0, (0, common_1.PathParams)('vault')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(2, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SettsV2Controller.prototype, "getSett", null);
SettsV2Controller = tslib_1.__decorate([
    (0, schema_1.Deprecated)(),
    (0, common_1.Controller)('/setts')
], SettsV2Controller);
exports.SettsV2Controller = SettsV2Controller;
//# sourceMappingURL=setts.v2.controller.js.map