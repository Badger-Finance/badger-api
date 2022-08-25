import { Network } from '@badger-dao/sdk';
import { BadRequest } from '@tsed/exceptions';

import { Arbitrum } from './config/arbitrum.config';
import { BinanceSmartChain } from './config/bsc.config';
import { Chain } from './config/chain.config';
import { Ethereum } from './config/eth.config';
import { Fantom } from './config/fantom.config';
import { Optimism } from './config/optimism.config';
import { Polygon } from './config/polygon.config';

export const SUPPORTED_NETWORKS = [
  Network.Ethereum,
  Network.BinanceSmartChain,
  Network.Polygon,
  Network.Arbitrum,
  Network.Fantom,
  Network.Optimism,
];

export function getSupportedChains(): Chain[] {
  return SUPPORTED_NETWORKS.map((n) => getOrCreateChain(n));
}

export function getOrCreateChain(network?: Network): Chain {
  try {
    return Chain.getChain(network);
  } catch {
    if (!network) {
      network = Network.Ethereum;
    }

    let chain: Chain;
    switch (network) {
      case Network.BinanceSmartChain:
        chain = new BinanceSmartChain();
        break;
      case Network.Polygon:
        chain = new Polygon();
        break;
      case Network.Arbitrum:
        chain = new Arbitrum();
        break;
      case Network.Fantom:
        chain = new Fantom();
        break;
      case Network.Optimism:
        chain = new Optimism();
        break;
      case Network.Ethereum:
        chain = new Ethereum();
        break;
      default:
        throw new BadRequest(`${network} is not a supported chain`);
    }
    Chain.register(network, chain);
    return chain;
  }
}
