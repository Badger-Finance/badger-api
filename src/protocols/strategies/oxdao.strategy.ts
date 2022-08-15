import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { getFullToken, getVaultTokens } from '../../tokens/tokens.utils';
import { getCachedVault, queryYieldSources } from '../../vaults/vaults.utils';

export class OxDaoStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]> {
    switch (vaultDefinition.address) {
      case TOKENS.BSMM_BVEOXD_OXD:
        return getLiquiditySources(chain, vaultDefinition);
      default:
        return [];
    }
  }
}

async function getLiquiditySources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]> {
  const bveOXDVault = await chain.vaults.getVault(TOKENS.BVEOXD);
  const [bveOXDLP, bveOXD, bveOXDSources] = await Promise.all([
    getCachedVault(chain, vaultDefinition),
    getCachedVault(chain, bveOXDVault),
    queryYieldSources(bveOXDVault)
  ]);
  const vaultTokens = await getVaultTokens(chain, bveOXDLP);
  const bveOXDValue = vaultTokens
    .filter((t) => t.address === TOKENS.BVEOXD)
    .map((t) => t.value)
    .reduce((total, val) => (total += val), 0);
  const scalar = bveOXDValue / bveOXDLP.value;
  const vaultToken = await getFullToken(chain, bveOXD.vaultToken);
  return bveOXDSources.map((s) => {
    if (s.type === SourceType.Compound || s.type === SourceType.PreCompound) {
      s.name = `${vaultToken.name} ${s.name}`;
      const sourceTypeName = `${s.type === SourceType.Compound ? 'Derivative ' : ''}${vaultToken.name} ${s.type}`;
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
