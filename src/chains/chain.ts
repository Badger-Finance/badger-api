import { Arbitrum } from './config/arbitrum.config';
import { BinanceSmartChain } from './config/bsc.config';
import { Ethereum } from './config/eth.config';
import { Fantom } from './config/fantom.config';
import { Optimism } from './config/optimism.config';
import { Polygon } from './config/polygon.config';

export const SUPPORTED_CHAINS = [
  new Ethereum(),
  new BinanceSmartChain(),
  new Polygon(),
  new Arbitrum(),
  new Fantom(),
  new Optimism()
];
