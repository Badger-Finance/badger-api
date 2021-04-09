import { Service } from '@tsed/di';
import { Chain } from '../../chains/config/chain.config';
import { UNISWAP_URL } from '../../config/constants';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { SwapService } from '../common/SwapService';
import { ValueSource } from '../interfaces/value-source.interface';

@Service()
export class UniswapService extends SwapService {
  constructor() {
    super(UNISWAP_URL, 'Uniswap');
  }

  // required abstract method, uniswap is not currently cross chain
  /* eslint-disable @typescript-eslint/no-unused-vars-experimental */
  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    // Currently WBTC / BADGER | DIGG is not supported by this tracking method,
    // once we have support for untracked volume, we can re-enable this.
    // return Promise.all([this.getSwapPerformance(sett.depositToken)]);
    return [];
  }
}
