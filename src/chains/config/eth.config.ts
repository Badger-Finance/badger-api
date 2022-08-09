import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  constructor() {
    super(
      Network.Ethereum,
      ethTokensConfig,
      rpc[Network.Ethereum],
      new BaseStrategy(Network.Ethereum, Object.keys(ethTokensConfig)),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }
}
