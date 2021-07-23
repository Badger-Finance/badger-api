import { BinanceSmartChain } from './config/bsc.config';
import { Chain } from './config/chain.config';
import { Ethereum } from './config/eth.config';
import { Polygon } from './config/matic.config';
import { xDai } from './config/xdai.config';

/**
 * Instantiate objects for registration.
 */
export const loadChains = (): Chain[] => {
  return [new Ethereum(), new BinanceSmartChain(), new Polygon(), new xDai()];
};
