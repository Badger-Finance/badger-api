import { Network } from '@badger-dao/sdk';

import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { ethTokensConfig } from '../../tokens/config/eth-tokens.config';
import { BaseStrategy } from '../strategies/base.strategy';
import { Chain } from './chain.config';
import { ethSetts } from './eth.config';

export class TestChain extends Chain {
  constructor() {
    super(
      'TEthereum',
      'teth',
      '0x1',
      Network.Ethereum,
      ethTokensConfig,
      '',
      ethSetts,
      new BaseStrategy(Network.Ethereum, Object.keys(ethTokensConfig)),
      '0x31825c0a6278b89338970e3eb979b05b27faa263',
    );
    Chain.register(this.network, this);
  }

  getGasPrices(): Promise<GasPrices> {
    throw new Error('Method not implemented.');
  }
}
