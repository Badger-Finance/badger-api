import { loadChains } from '../chains/chain';
import { updatePrice } from '../prices/prices.utils';

export const indexPrices = async (): Promise<void> => {
  const chains = loadChains();
  const tokens = chains.flatMap((c) => Object.values(c.tokens));
  for (const token of tokens) {
    await updatePrice(token);
  }
};
