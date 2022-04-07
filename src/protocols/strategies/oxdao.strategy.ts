import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { getCachedVault, getVaultCachedValueSources, getVaultDefinition } from '../../vaults/vaults.utils';
import { getFullToken, getVaultTokens } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { SourceType } from '../../rewards/enums/source-type.enum';

export class OxDaoStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    switch (vaultDefinition.vaultToken) {
      case TOKENS.BSMM_BVEOXD_OXD:
        return getLiquiditySources(chain, vaultDefinition);
      default:
        return [];
    }
  }
}

async function getLiquiditySources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const bveOXDVault = getVaultDefinition(chain, TOKENS.BVEOXD);
  const [bveOXDLP, bveOXD, bveOXDSources] = await Promise.all([
    getCachedVault(chain, vaultDefinition),
    getCachedVault(chain, bveOXDVault),
    getVaultCachedValueSources(bveOXDVault),
  ]);
  const vaultTokens = await getVaultTokens(chain, bveOXDLP, bveOXDLP.balance);
  const bveOXDValue = vaultTokens
    .filter((t) => t.address === TOKENS.BVEOXD)
    .map((t) => t.value)
    .reduce((val, total) => (total += val), 0);
  const scalar = bveOXDValue / bveOXDLP.value;
  const vaultToken = await getFullToken(chain, bveOXD.vaultToken);
  return bveOXDSources.map((s) => {
    if (s.type === SourceType.Compound || s.type === SourceType.PreCompound) {
      s.name = `${vaultToken.name} ${s.name}`;
      const sourceTypeName = `${s.type === SourceType.Compound ? 'Derivative ' : ''}${vaultToken.name} ${s.type}`;
      s.addressValueSourceType = s.addressValueSourceType.replace(
        s.type,
        sourceTypeName.replace(/ /g, '_').toLowerCase(),
      );
    }
    // rewrite object keys to simulate sources from the lp vault
    s.addressValueSourceType = s.addressValueSourceType.replace(bveOXD.vaultToken, bveOXDLP.vaultToken);
    s.address = bveOXDLP.vaultToken;
    s.apr *= scalar;
    s.maxApr *= scalar;
    s.minApr *= scalar;
    return s;
  });
}
