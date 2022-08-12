"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultsV2Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const vault_harvests_list_model_interface_1 = require("./interfaces/vault-harvests-list-model.interface");
const vault_harvests_model_interface_1 = require("./interfaces/vault-harvests-model.interface");
const vault_model_interface_1 = require("./interfaces/vault-model.interface");
const vaults_service_1 = require("./vaults.service");
let VaultsV2Controller = class VaultsV2Controller {
    async listVaults(chain, currency) {
        return this.vaultService.listVaults(chain_config_1.Chain.getChain(chain), currency);
    }
    async getlistVaultHarvests(chain) {
        return this.vaultService.listVaultHarvests(chain_config_1.Chain.getChain(chain));
    }
    async getVaultsHarvests(vault, chain) {
        return this.vaultService.getVaultHarvests(chain_config_1.Chain.getChain(chain), vault);
    }
    async getVault(vault, chain, currency) {
        const chainInst = chain_config_1.Chain.getChain(chain);
        const vaultDef = await chainInst.vaults.getVault(vault);
        return vaults_service_1.VaultsService.loadVault(chainInst, vaultDef, currency);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", vaults_service_1.VaultsService)
], VaultsV2Controller.prototype, "vaultService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a list of protocol vaults'),
    (0, schema_1.Description)('Return a list of protocol vaults for the requested chain'),
    (0, schema_1.Returns)(200, vault_model_interface_1.VaultModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(1, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV2Controller.prototype, "listVaults", null);
tslib_1.__decorate([
    (0, common_1.Get)('/harvests'),
    (0, common_1.UseCache)(),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get all vaults harvests on a chain'),
    (0, schema_1.Description)('Return map of vaults, with harvests'),
    (0, schema_1.Returns)(200, vault_harvests_list_model_interface_1.VaultHarvestsMapModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    tslib_1.__param(0, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV2Controller.prototype, "getlistVaultHarvests", null);
tslib_1.__decorate([
    (0, common_1.Get)('/harvests/:vault'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get harvests on a specific vault'),
    (0, schema_1.Description)('Return full list of vault`s harvests'),
    (0, schema_1.Returns)(200, Array).Of(vault_harvests_model_interface_1.VaultHarvestsModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    tslib_1.__param(0, (0, common_1.PathParams)('vault')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV2Controller.prototype, "getVaultsHarvests", null);
tslib_1.__decorate([
    (0, common_1.Get)('/:vault'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a specific vault'),
    (0, schema_1.Description)('Return a specific vault for the requested chain'),
    (0, schema_1.Returns)(200, vault_model_interface_1.VaultModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    (0, schema_1.Returns)(404).Description('Not a valid vault'),
    tslib_1.__param(0, (0, common_1.PathParams)('vault')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(2, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV2Controller.prototype, "getVault", null);
VaultsV2Controller = tslib_1.__decorate([
    (0, schema_1.Deprecated)(),
    (0, common_1.Controller)('/vaults')
], VaultsV2Controller);
exports.VaultsV2Controller = VaultsV2Controller;
//# sourceMappingURL=vaults.v2.controller.js.map