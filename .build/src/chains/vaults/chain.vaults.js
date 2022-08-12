"use strict";
var _ChainVaults_instances, _ChainVaults_shouldUpdate, _ChainVaults_updateCachedVaults;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChainVaults = void 0;
const tslib_1 = require("tslib");
const exceptions_1 = require("@tsed/exceptions");
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../../aws/dynamodb.utils");
const vault_definition_model_1 = require("../../aws/models/vault-definition.model");
const constants_1 = require("../../config/constants");
const stage_enum_1 = require("../../config/enums/stage.enum");
class ChainVaults {
    constructor(network) {
        _ChainVaults_instances.add(this);
        this.cachedVaults = [];
        this.cacheTtl = constants_1.ONE_MINUTE_SECONDS * 2 * 1000;
        this.network = network;
    }
    async all() {
        await tslib_1.__classPrivateFieldGet(this, _ChainVaults_instances, "m", _ChainVaults_updateCachedVaults).call(this);
        return this.cachedVaults;
    }
    async getVault(address) {
        await tslib_1.__classPrivateFieldGet(this, _ChainVaults_instances, "m", _ChainVaults_updateCachedVaults).call(this);
        const requestAddress = ethers_1.ethers.utils.getAddress(address);
        const vault = Object.fromEntries(this.cachedVaults.map((v) => [v.address, v]))[requestAddress];
        if (!vault) {
            throw new exceptions_1.NotFound(`No vault exists with address ${requestAddress}`);
        }
        return vault;
    }
}
exports.ChainVaults = ChainVaults;
_ChainVaults_instances = new WeakSet(), _ChainVaults_shouldUpdate = function _ChainVaults_shouldUpdate() {
    if (!this.updatedAt) {
        return true;
    }
    return Date.now() - this.updatedAt > this.cacheTtl;
}, _ChainVaults_updateCachedVaults = async function _ChainVaults_updateCachedVaults() {
    if (tslib_1.__classPrivateFieldGet(this, _ChainVaults_instances, "m", _ChainVaults_shouldUpdate).call(this)) {
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        const query = mapper.query(vault_definition_model_1.VaultDefinitionModel, { chain: this.network, isProduction: 1 }, { indexName: 'IndexVaultCompoundDataChainIsProd' });
        try {
            for await (const vault of query) {
                const index = this.cachedVaults.findIndex((v) => v.address === vault.address);
                if (index >= 0) {
                    this.cachedVaults[index] = vault;
                }
                else {
                    if (vault.stage === stage_enum_1.Stage.Production || vault.stage === constants_1.STAGE) {
                        this.cachedVaults.push(vault);
                    }
                }
            }
        }
        catch (e) {
            console.error(`Failed to update cached vaults for ${this.network} network. ${e}`);
        }
        this.updatedAt = Date.now();
    }
};
//# sourceMappingURL=chain.vaults.js.map