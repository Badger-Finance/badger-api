import { Arbitrum } from './config/arbitrum.config';
import { BinanceSmartChain } from './config/bsc.config';
import { Chain } from './config/chain.config';
import { Ethereum } from './config/eth.config';
import { Polygon } from './config/matic.config';

/**
 * Instantiate objects for registration.
 */
export const loadChains = (): Chain[] => {
  return [new Ethereum(), new BinanceSmartChain(), new Polygon(), new Arbitrum()];
};
