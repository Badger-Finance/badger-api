import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { Chain } from '../../chains/config/chain.config';
import { SWAPR_URL } from '../../config/constants';
import { getUniV2SwapValue } from './strategy.utils';

export class SwaprStrategy {
  static async getValueSources(_chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(SWAPR_URL, vaultDefinition)]);
  }
}
