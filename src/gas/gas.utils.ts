import NodeCache from 'node-cache';
import { loadChains } from '../chains/chain';
import { ChainGasPrices } from './interfaces/gas-prices.interface';

const gasCache = new NodeCache({ stdTTL: 100, checkperiod: 101 });

export async function getGasCache(): Promise<ChainGasPrices> {
  let gasPricesCache: ChainGasPrices = {};
  const cachedGasPrices = gasCache.get('gasPrices');
  console.log('cache object:', cachedGasPrices, gasCache.keys());
  if (!cachedGasPrices) {
    console.log('cache miss');
    gasPricesCache = await loadGasPrices();
    try {
      gasCache.set('gasPrices', gasPricesCache);
      console.log('gas cache set:', gasCache.keys(), gasCache.get('gasPrices'));
    } catch (err) {
      console.error('error:', err);
    }
    return gasPricesCache;
  } else {
    return cachedGasPrices as ChainGasPrices;
  }
}

async function loadGasPrices(): Promise<ChainGasPrices> {
  const chains = loadChains();
  const gasReturn: ChainGasPrices = {};
  await Promise.all(chains.flatMap(async (c) => (gasReturn[c.network] = await c.getGasPrices())));
  return gasReturn;
}
