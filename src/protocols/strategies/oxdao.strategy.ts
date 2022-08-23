import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { getVaultTokens } from '../../tokens/tokens.utils';
import { getCachedVault, queryYieldSources } from '../../vaults/vaults.utils';
import { createYieldSource } from '../../vaults/yields.utils';

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
  const [bveOXDLP, bveOXDSources] = await Promise.all([
    getCachedVault(chain, vaultDefinition),
    queryYieldSources(bveOXDVault),
  ]);
  const vaultTokens = await getVaultTokens(chain, bveOXDLP);
  const bveOXDValue = vaultTokens
    .filter((t) => t.address === TOKENS.BVEOXD)
    .map((t) => t.value)
    .reduce((total, val) => (total += val), 0);
  const scalar = bveOXDValue / bveOXDLP.value;
  return bveOXDSources.map((s) => {
    const { apr, minApr, maxApr, name, type } = s;
    const scaledApr = apr * scalar;
    const min = apr > 0 ? minApr / apr : 0;
    const max = apr > 0 ? maxApr / apr : 0;
    return createYieldSource(vaultDefinition, type, name, scaledApr, { min, max });
  });
}
