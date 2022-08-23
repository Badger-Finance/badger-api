import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { fantomTokensConfig } from '../../tokens/config/fantom-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Fantom extends Chain {
  constructor() {
    super(Network.Fantom, fantomTokensConfig, rpc[Network.Fantom], new BaseStrategy(Network.Fantom));
    Chain.register(this.network, this);
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MULTI_BADGER;
  }
}
