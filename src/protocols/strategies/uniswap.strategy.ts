import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { UNISWAP_URL } from '../../config/constants';
import { getUniV2SwapValue } from './strategy.utils';

export class UniswapStrategy {
  static async getValueSources(vault: VaultDefinitionModel): Promise<YieldSource[]> {
    return Promise.all([getUniV2SwapValue(UNISWAP_URL, vault)]);
  }
}
