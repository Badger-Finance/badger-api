import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  constructor() {
    super(Network.Ethereum, ethTokensConfig, rpc[Network.Ethereum], new BaseStrategy(Network.Ethereum));
    Chain.register(this.network, this);
  }
}
