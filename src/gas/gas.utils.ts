import NodeCache from 'node-cache';
import { loadChains } from '../chains/chain';
import { ChainGasPrices } from './interfaces/gas-prices.interface';

const gasCache = new NodeCache({ stdTTL: 100, checkperiod: 101 });

export async function getGasCache(): Promise<ChainGasPrices> {
  let gasPricesCache: ChainGasPrices = {};
  const cachedGasPrices = gasCache.get('gasPrices');
  if (!cachedGasPrices) {
    gasPricesCache = await loadGasPrices();
    try {
      gasCache.set('gasPrices', gasPricesCache);
    } catch (err) {
      console.error('error:', err);
    }
    return gasPricesCache;
  } else {
    return cachedGasPrices as ChainGasPrices;
  }
}

export async function loadGasPrices(): Promise<ChainGasPrices> {
  const chains = loadChains();
  const gasReturn: ChainGasPrices = {};
  await Promise.all(chains.flatMap(async (c) => (gasReturn[c.network] = await c.getGasPrices())));
  return gasReturn;
}
