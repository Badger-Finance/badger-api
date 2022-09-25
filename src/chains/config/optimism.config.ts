import { Network } from '@badger-dao/sdk';

import rpc from '../../config/rpc.config';
import { Chain } from './chain.config';

export class Optimism extends Chain {
  constructor() {
    super(Network.Optimism, {}, rpc[Network.Optimism]);
    Chain.register(this.network, this);
  }
}
