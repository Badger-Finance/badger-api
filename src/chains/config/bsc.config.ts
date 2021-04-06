import { ethers } from 'ethers';
import { BADGER_BSC_URL, Protocol, Provider, TOKENS } from '../../config/constants';
import { SettDefinition } from '../../interface/Sett';
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
      bscTokensConfig,
      bscSetts,
      new ethers.providers.JsonRpcProvider(Provider.Binance),
      new BscStrategy(),
      BADGER_BSC_URL,
      10512000,
    );
    Chain.register(ChainNetwork.BinanceSmartChain, this);
  }
}

export const bscSetts: SettDefinition[] = [
  {
    name: 'Pancakeswap BNB/BTCB',
    symbol: 'PLP-BNB-BTCB',
    depositToken: TOKENS.PANCAKE_BNB_BTCB,
    settToken: TOKENS.BPANCAKE_BNB_BTCB,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bBADGER/BTCB',
    symbol: 'PLP-BBADGER-BTCB',
    depositToken: TOKENS.PANCAKE_BBADGER_BTCB,
    settToken: TOKENS.BPANCAKE_BBADGER_BTCB,
    protocol: Protocol.Pancakeswap,
  },
  {
    name: 'Pancakeswap bDIGG/BTCB',
    symbol: 'PLP-BDIGG-BTCB',
    depositToken: TOKENS.PANCAKE_BDIGG_BTCB,
    settToken: TOKENS.BPANCAKE_BDIGG_BTCB,
    protocol: Protocol.Pancakeswap,
  },
];
