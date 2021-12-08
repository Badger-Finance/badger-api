import { QUICKSWAP_URL } from '../../config/constants';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { getUniV2SwapValue } from './strategy.utils';

export class QuickswapStrategy {
  static async getValueSources(VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(QUICKSWAP_URL, VaultDefinition)]);
  }
}
