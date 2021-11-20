import { Network, Protocol, SettState } from '@badger-dao/sdk';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { BscStrategy } from '../strategies/bsc.strategy';
import { Chain } from './chain.config';

export class BinanceSmartChain extends Chain {
  constructor() {
    super(
      'BinanceSmartChain',
      'bsc',
      '0x38',
      Network.BinanceSmartChain,
      bscTokensConfig,
      bscSetts,
      rpc[Network.BinanceSmartChain],
      new BscStrategy(Object.keys(bscTokensConfig)),
      10512000,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    return this.defaultGasPrice();
  }
}

export const bscSetts: SettDefinition[] = [
  {
    name: 'BNB/BTCB',
    createdBlock: 5516404,
    depositToken: TOKENS.PANCAKE_BNB_BTCB,
    settToken: TOKENS.BPANCAKE_BNB_BTCB,
    state: SettState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'bBADGER/BTCB',
    createdBlock: 5712803,
    depositToken: TOKENS.PANCAKE_BBADGER_BTCB,
    settToken: TOKENS.BPANCAKE_BBADGER_BTCB,
    state: SettState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'bDIGG/BTCB',
    createdBlock: 5712807,
    depositToken: TOKENS.PANCAKE_BDIGG_BTCB,
    settToken: TOKENS.BPANCAKE_BDIGG_BTCB,
    state: SettState.Deprecated,
    protocol: Protocol.Pancakeswap,
  },
];
