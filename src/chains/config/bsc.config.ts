import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { Chain } from './chain.config';

export class BinanceSmartChain extends Chain {
  constructor() {
    super(Network.BinanceSmartChain, bscTokensConfig, rpc[Network.BinanceSmartChain]);
    Chain.register(this.network, this);
  }

  getBadgerTokenAddress(): string {
    return TOKENS.MULTI_BADGER;
  }
}
