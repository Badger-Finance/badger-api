import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { UNISWAP_URL } from '../../config/constants';
import { getUniV2SwapValue } from './strategy.utils';

export class UniswapStrategy {
  static async getValueSources(vault: VaultDefinitionModel): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(UNISWAP_URL, vault)]);
  }
}
