import { Chain } from '../../chains/config/chain.config';
import { SWAPR_URL } from '../../config/constants';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { getUniV2SwapValue } from './strategy.utils';

export class SwaprStrategy {
  static async getValueSources(_chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(SWAPR_URL, vaultDefinition)]);
  }
}
