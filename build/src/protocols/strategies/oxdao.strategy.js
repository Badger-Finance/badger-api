"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxDaoStrategy = void 0;
const tokens_config_1 = require("../../config/tokens.config");
const source_type_enum_1 = require("../../rewards/enums/source-type.enum");
const tokens_utils_1 = require("../../tokens/tokens.utils");
const vaults_utils_1 = require("../../vaults/vaults.utils");
class OxDaoStrategy {
    static async getValueSources(chain, vaultDefinition) {
        switch (vaultDefinition.address) {
            case tokens_config_1.TOKENS.BSMM_BVEOXD_OXD:
                return getLiquiditySources(chain, vaultDefinition);
            default:
                return [];
        }
    }
}
exports.OxDaoStrategy = OxDaoStrategy;
async function getLiquiditySources(chain, vaultDefinition) {
    const bveOXDVault = await chain.vaults.getVault(tokens_config_1.TOKENS.BVEOXD);
    const [bveOXDLP, bveOXD, bveOXDSources] = await Promise.all([
        (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition),
        (0, vaults_utils_1.getCachedVault)(chain, bveOXDVault),
        (0, vaults_utils_1.queryYieldSources)(bveOXDVault),
    ]);
    const vaultTokens = await (0, tokens_utils_1.getVaultTokens)(chain, bveOXDLP);
    const bveOXDValue = vaultTokens
        .filter((t) => t.address === tokens_config_1.TOKENS.BVEOXD)
        .map((t) => t.value)
        .reduce((total, val) => (total += val), 0);
    const scalar = bveOXDValue / bveOXDLP.value;
    const vaultToken = await (0, tokens_utils_1.getFullToken)(chain, bveOXD.vaultToken);
    return bveOXDSources.map((s) => {
        if (s.type === source_type_enum_1.SourceType.Compound || s.type === source_type_enum_1.SourceType.PreCompound) {
            s.name = `${vaultToken.name} ${s.name}`;
            const sourceTypeName = `${s.type === source_type_enum_1.SourceType.Compound ? 'Derivative ' : ''}${vaultToken.name} ${s.type}`;
            s.id = s.id.replace(s.type, sourceTypeName.replace(/ /g, '_').toLowerCase());
        }
        // rewrite object keys to simulate sources from the lp vault
        s.id = s.id.replace(bveOXD.vaultToken, bveOXDLP.vaultToken);
        s.address = bveOXDLP.vaultToken;
        s.apr *= scalar;
        s.maxApr *= scalar;
        s.minApr *= scalar;
        return s;
    });
}
//# sourceMappingURL=oxdao.strategy.js.map