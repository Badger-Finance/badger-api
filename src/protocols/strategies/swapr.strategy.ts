import { Chain } from '../../chains/config/chain.config';
import { SWAPR_SUBGRAPH_URL } from '../../config/constants';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { getUniV2SwapValue } from './strategy.utils';

export class SwaprStrategy {
  static async getValueSources(_chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(SWAPR_SUBGRAPH_URL, settDefinition)]);
  }
}
