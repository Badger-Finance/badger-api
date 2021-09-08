import { loadChains } from '../chains/chain';
import { updatePrices } from '../prices/prices.utils';

export const indexPrices = async (): Promise<void> => {
  const tokens = Object.fromEntries(loadChains().flatMap((c) => Object.entries(c.tokens)));
  await updatePrices(tokens);
};
