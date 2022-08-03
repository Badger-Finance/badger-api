import { Network } from '@badger-dao/sdk';

import RPC from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { arbitrumTokensConfig } from '../../tokens/config/arbitrum-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';

export class Arbitrum extends Chain {
  constructor() {
    super(
      'Arbitrum',
      'arbitrum',
      '0xa4b1',
      Network.Arbitrum,
      arbitrumTokensConfig,
      RPC[Network.Arbitrum],
      new BaseStrategy(Network.Arbitrum, Object.keys(arbitrumTokensConfig)),
      '0x78418681f9ed228d627f785fb9607ed5175518fd',
    );
    Chain.register(this.network, this);
  }

  getBadgerTokenAddress(): string {
    return TOKENS.ARB_BADGER;
  }
}
