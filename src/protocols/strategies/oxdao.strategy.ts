import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { getCachedVault, getVaultCachedValueSources, getVaultDefinition } from '../../vaults/vaults.utils';
import { getVaultTokens } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';

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
    .filter((t) => t.address === TOKENS.BVECVX)
    .map((t) => t.value)
    .reduce((val, total) => (total += val), 0);
  const scalar = bveOXDValue / bveOXDLP.value;
  return bveOXDSources.map((s) => {
    // rewrite object keys to simulate sources from the lp vault
    s.addressValueSourceType = s.addressValueSourceType.replace(bveOXD.vaultToken, bveOXDLP.vaultToken);
    s.address = s.address.replace(bveOXD.vaultToken, bveOXDLP.vaultToken);
    s.apr *= scalar;
    s.maxApr *= scalar;
    s.minApr *= scalar;
    return s;
  });
}
