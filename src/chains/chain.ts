import { BinanceSmartChain } from './config/bsc.config';
import { Ethereum } from './config/eth.config';

/**
 * Instantiate objects for registration.
 */
export const loadChains = (): void => {
  new Ethereum();
  new BinanceSmartChain();
};
