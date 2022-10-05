import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { SWAPR_URL } from '../../config/constants';
import { getUniV2SwapValue } from './uniswap.strategy';

/**
 * Load swapr non-emitted yield sources.
 * @param vaultDefinition requested vault
 * @returns yield sources vault earns that are not harvested
 */
export async function getSwaprYieldSources(vaultDefinition: VaultDefinitionModel): Promise<CachedYieldSource[]> {
  const feeSource = await getUniV2SwapValue(SWAPR_URL, vaultDefinition);
  if (feeSource) {
    return [feeSource];
  }
  return [];
}
