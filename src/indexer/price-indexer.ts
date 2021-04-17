import { loadChains } from '../chains/chain';
import { updatePrices } from '../prices/prices.utils';
import { protocolTokens } from '../tokens/tokens-util';

export const indexPrices = async (): Promise<void> => {
  loadChains();
  await updatePrices(protocolTokens);
};
