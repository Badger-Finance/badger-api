import { updatePrices } from '../../prices/prices-util';
import { protocolTokens } from '../../tokens/tokens-util';

export const handler = async (): Promise<void> => {
  await updatePrices(protocolTokens);
};
