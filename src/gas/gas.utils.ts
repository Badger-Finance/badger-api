import NodeCache from 'node-cache';
import { loadChains } from '../chains/chain';
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
  const entries = await Promise.all(chains.map(async (c) => [c.network, await c.getGasPrices()]));
  return Object.fromEntries(entries);
}
