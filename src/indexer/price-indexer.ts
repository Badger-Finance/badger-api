import { initStrategies } from '../config/chain/chain';
import { updatePrices } from '../prices/prices-util';
import { protocolTokens } from '../tokens/tokens-util';

export const indexPrices = async (): Promise<void> => {
  initStrategies();
  await updatePrices(protocolTokens);
};
