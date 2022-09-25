import { Network } from '@badger-dao/sdk';

import RPC from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { Chain } from './chain.config';

export class Arbitrum extends Chain {
  constructor() {
    super(Network.Arbitrum, arbitrumTokensConfig, RPC[Network.Arbitrum]);
    Chain.register(this.network, this);
  }

  getBadgerTokenAddress(): string {
    return TOKENS.ARB_BADGER;
  }
}
