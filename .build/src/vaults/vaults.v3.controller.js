"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultsV3Controller = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const schema_1 = require("@tsed/schema");
const chain_config_1 = require("../chains/config/chain.config");
const query_param_error_1 = require("../errors/validation/query.param.error");
const vault_harvests_list_model_interface_1 = require("./interfaces/vault-harvests-list-model.interface");
const vault_harvests_model_interface_1 = require("./interfaces/vault-harvests-model.interface");
const vault_model_interface_1 = require("./interfaces/vault-model.interface");
const vaults_service_1 = require("./vaults.service");
let VaultsV3Controller = class VaultsV3Controller {
    async getVault(address, chain, currency) {
        if (!address) {
            throw new query_param_error_1.QueryParamError('vault');
        }
        const chainInst = chain_config_1.Chain.getChain(chain);
        const compoundVault = await chainInst.vaults.getVault(address);
        return vaults_service_1.VaultsService.loadVault(chainInst, compoundVault, currency);
    }
    async listVaults(chain, currency) {
        return this.vaultService.listVaults(chain_config_1.Chain.getChain(chain), currency);
    }
    async getVaultsHarvests(vault, chain) {
        if (!vault)
            throw new query_param_error_1.QueryParamError('vault');
        return this.vaultService.getVaultHarvests(chain_config_1.Chain.getChain(chain), vault);
    }
    async getlistVaultHarvests(chain) {
        return this.vaultService.listVaultHarvests(chain_config_1.Chain.getChain(chain));
    }
    async getVaultSnapshotsInRange(vault, timestamps, chain) {
        if (!vault) {
            throw new query_param_error_1.QueryParamError('vault');
        }
        if (!timestamps) {
            throw new query_param_error_1.QueryParamError('timestamps');
        }
        const timestampsList = timestamps.split(',').map((n) => Number(n));
        const isTimestampsValid = timestampsList.every((time) => time > 0);
        if (!isTimestampsValid) {
            throw new query_param_error_1.QueryParamError('timestamps');
        }
        return this.vaultService.getVaultChartDataByTimestamps(vault, chain_config_1.Chain.getChain(chain), timestampsList);
    }
};
tslib_1.__decorate([
    (0, common_1.Inject)(),
    tslib_1.__metadata("design:type", vaults_service_1.VaultsService)
], VaultsV3Controller.prototype, "vaultService", void 0);
tslib_1.__decorate([
    (0, common_1.Get)(),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get a specific vault'),
    (0, schema_1.Description)('Return a specific vault for the requested chain'),
    (0, schema_1.Returns)(200, vault_model_interface_1.VaultModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    (0, schema_1.Returns)(404).Description('Not a valid vault'),
    tslib_1.__param(0, (0, common_1.QueryParams)('address')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__param(2, (0, common_1.QueryParams)('currency')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV3Controller.prototype, "getVault", null);
tslib_1.__decorate([
    (0, common_1.Get)('/list'),
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
], VaultsV3Controller.prototype, "listVaults", null);
tslib_1.__decorate([
    (0, common_1.Get)('/harvests'),
    (0, schema_1.ContentType)('json'),
    (0, schema_1.Summary)('Get harvests on a specific vault'),
    (0, schema_1.Description)('Return full list of vault`s harvests'),
    (0, schema_1.Returns)(200, Array).Of(vault_harvests_model_interface_1.VaultHarvestsModel),
    (0, schema_1.Returns)(400).Description('Not a valid chain'),
    tslib_1.__param(0, (0, common_1.QueryParams)('vault')),
    tslib_1.__param(1, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV3Controller.prototype, "getVaultsHarvests", null);
tslib_1.__decorate([
    (0, common_1.Get)('/list/harvests'),
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
], VaultsV3Controller.prototype, "getlistVaultHarvests", null);
tslib_1.__decorate([
    (0, schema_1.Hidden)(),
    (0, common_1.UseCache)(),
    (0, common_1.Get)('/snapshots'),
    (0, schema_1.ContentType)('json'),
    tslib_1.__param(0, (0, common_1.QueryParams)('vault')),
    tslib_1.__param(1, (0, common_1.QueryParams)('timestamps')),
    tslib_1.__param(2, (0, common_1.QueryParams)('chain')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], VaultsV3Controller.prototype, "getVaultSnapshotsInRange", null);
VaultsV3Controller = tslib_1.__decorate([
    (0, common_1.Controller)('/vaults')
], VaultsV3Controller);
exports.VaultsV3Controller = VaultsV3Controller;
//# sourceMappingURL=vaults.v3.controller.js.map