import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { Chain } from '../../chains/config/chain.config';
import { SWAPR_URL } from '../../config/constants';
import { getUniV2SwapValue } from './uniswap.strategy';

export class SwaprStrategy {
  static async getValueSources(_chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<CachedYieldSource[]> {
    return Promise.all([getUniV2SwapValue(SWAPR_URL, vaultDefinition)]);
  }
}
