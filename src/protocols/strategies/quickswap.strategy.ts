import { QUICKSWAP_URL } from '../../config/constants';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { getUniV2SwapValue } from './strategy.utils';

export class QuickswapStrategy {
  static async getValueSources(settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getUniV2SwapValue(QUICKSWAP_URL, settDefinition)]);
  }
}
