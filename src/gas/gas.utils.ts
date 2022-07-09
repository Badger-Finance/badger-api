import NodeCache from 'node-cache';

import { Chain } from '../chains/config/chain.config';
import { ChainGasPrices } from './interfaces/gas-prices.interface';

const gasCache = new NodeCache({ stdTTL: 15, checkperiod: 17 });

export async function getGasCache(chains: Chain[]): Promise<ChainGasPrices> {
  const cachedGasPrices = gasCache.get<ChainGasPrices>('gasPrices');
  if (cachedGasPrices) {
    return cachedGasPrices;
  }
  const chainGasPrices = await Promise.all(chains.map(async (c) => [c.network, await c.getGasPrices()]));
  const gasPrices = Object.fromEntries(chainGasPrices);
  gasCache.set('gasPrices', gasPrices);
  return gasPrices;
}
