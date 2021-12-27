import { loadChains } from '../chains/chain';
import { updatePrice } from '../prices/prices.utils';

export const indexPrices = async (): Promise<void> => {
  const tokens = loadChains().flatMap((c) => Object.values(c.tokens));
  await Promise.all(tokens.map(async (token) => updatePrice(token)));
};
