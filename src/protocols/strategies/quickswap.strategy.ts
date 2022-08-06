import { YieldSource } from '../../aws/models/yield-source.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { QUICKSWAP_URL } from '../../config/constants';
import { getUniV2SwapValue } from './strategy.utils';

export class QuickswapStrategy {
  static async getValueSources(vault: VaultDefinitionModel): Promise<YieldSource[]> {
    return Promise.all([getUniV2SwapValue(QUICKSWAP_URL, vault)]);
  }
}
