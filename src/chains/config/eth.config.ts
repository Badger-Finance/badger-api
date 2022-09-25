import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { Chain } from './chain.config';

export class Ethereum extends Chain {
  constructor() {
    super(Network.Ethereum, ethTokensConfig, rpc[Network.Ethereum]);
    Chain.register(this.network, this);
  }
}
