import { GasPrices, Network } from '@badger-dao/sdk';
import NodeCache from 'node-cache';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { formatBalance } from '../tokens/tokens.utils';
import { ChainGasPrices } from './interfaces/gas-prices.interface';

const gasCache = new NodeCache({ stdTTL: 15, checkperiod: 17 });

export async function getGasCache(): Promise<ChainGasPrices> {
  const cachedGasPrices = gasCache.get<ChainGasPrices>('gasPrices');
  if (cachedGasPrices) {
    return cachedGasPrices;
  }
  const gasPrices = await loadGasPrices();
  gasCache.set('gasPrices', gasPrices);
  return gasPrices;
}

export async function loadGasPrices(): Promise<ChainGasPrices> {
  const chains = loadChains();
  const entries = await Promise.all(
    chains.map(async (c) => {
      try {
        const prices = await c.getGasPrices();
        return [c.network, prices];
      } catch {
        return [c.network, await defaultGasPrice(c)];
      }
    }),
  );
  return Object.fromEntries(entries);
}

export async function defaultGasPrice(chain: Chain): Promise<GasPrices> {
  const gasPrice = formatBalance(await chain.provider.getGasPrice(), 9);
  if (chain.network === Network.Ethereum) {
    const defaultPriorityFee = 2;
    return {
      rapid: {
        maxFeePerGas: defaultPriorityFee,
        maxPriorityFeePerGas: gasPrice * 2,
      },
      fast: {
        maxFeePerGas: defaultPriorityFee,
        maxPriorityFeePerGas: gasPrice * 1.9,
      },
      standard: {
        maxFeePerGas: defaultPriorityFee,
        maxPriorityFeePerGas: gasPrice * 1.8,
      },
      slow: {
        maxFeePerGas: defaultPriorityFee,
        maxPriorityFeePerGas: gasPrice * 1.7,
      },
    };
  }
  return {
    rapid: gasPrice,
    fast: gasPrice,
    standard: gasPrice,
    slow: gasPrice,
  };
}
