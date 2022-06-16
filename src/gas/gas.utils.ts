import NodeCache from 'node-cache';

import { SUPPORTED_CHAINS } from '../chains/chain';
import { ChainGasPrices } from './interfaces/gas-prices.interface';

const gasCache = new NodeCache({ stdTTL: 15, checkperiod: 17 });

export async function getGasCache(): Promise<ChainGasPrices> {
  const cachedGasPrices = gasCache.get<ChainGasPrices>('gasPrices');
  if (cachedGasPrices) {
    return cachedGasPrices;
  }
  const chainGasPrices = await Promise.all(SUPPORTED_CHAINS.map(async (c) => [c.network, await c.getGasPrices()]));
  const gasPrices = Object.fromEntries(chainGasPrices);
  gasCache.set('gasPrices', gasPrices);
  return gasPrices;
}
