import { loadChains } from '../chains/chain';
import { updatePrice } from '../prices/prices.utils';

export const indexPrices = async (): Promise<void> => {
  const chains = loadChains();
  const tokens = chains.flatMap((c) => Object.values(c.tokens));
  for (let i = 0; i < tokens.length; i += 5) {
    const updateTokens = tokens.slice(i, i + 5);
    await Promise.all(updateTokens.map(async (t) => updatePrice(t)));
  }
};
