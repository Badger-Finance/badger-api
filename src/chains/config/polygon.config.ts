import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { maticTokensConfig } from '../../tokens/config/polygon-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Polygon extends Chain {
  constructor() {
    super(
      Network.Polygon,
      maticTokensConfig,
      rpc[Network.Polygon],
      new BaseStrategy(Network.Polygon, Object.keys(maticTokensConfig)),
    );
    Chain.register(this.network, this);
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MATIC_BADGER;
  }
}
