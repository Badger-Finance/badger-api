import { BADGER_BSC_URL } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import rpc from '../../config/rpc.config';
import { TOKENS } from '../../config/tokens.config';
import { GasPrices } from '../../gas/interfaces/gas-prices.interface';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { bscTokensConfig } from '../../tokens/config/bsc-tokens.config';
import { ChainNetwork } from '../enums/chain-network.enum';
import { BscStrategy } from '../strategies/bsc.strategy';
import { Chain } from './chain.config';

export class BinanceSmartChain extends Chain {
  constructor() {
    super(
      'BinanceSmartChain',
      'bsc',
      '0x38',
      ChainNetwork.BinanceSmartChain,
      bscTokensConfig,
      bscSetts,
      rpc[ChainNetwork.BinanceSmartChain],
      new BscStrategy(Object.keys(bscTokensConfig)),
      BADGER_BSC_URL,
      10512000,
    );
    Chain.register(this.network, this);
  }

  async getGasPrices(): Promise<GasPrices> {
    const gasPrice = 5;
    return {
      rapid: gasPrice,
      fast: gasPrice,
      standard: gasPrice,
      slow: gasPrice,
    };
  }
}

export const bscSetts: SettDefinition[] = [
  {
    name: 'Pancakeswap BNB/BTCB',
    createdBlock: 5516404,
    depositToken: TOKENS.PANCAKE_BNB_BTCB,
    deprecated: true,
    settToken: TOKENS.BPANCAKE_BNB_BTCB,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bBADGER/BTCB',
    createdBlock: 5712803,
    depositToken: TOKENS.PANCAKE_BBADGER_BTCB,
    deprecated: true,
    settToken: TOKENS.BPANCAKE_BBADGER_BTCB,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bDIGG/BTCB',
    createdBlock: 5712807,
    depositToken: TOKENS.PANCAKE_BDIGG_BTCB,
    deprecated: true,
    settToken: TOKENS.BPANCAKE_BDIGG_BTCB,
    protocol: Protocol.Pancakeswap,
  },
];
