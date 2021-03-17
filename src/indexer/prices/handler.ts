import { PriceUpdateRequest, updatePrices } from '../../prices/prices-util';
import { getPriceUpdateRequest, protocolTokens } from '../../tokens/tokens-util';

export const handler = async (): Promise<void> => {
  const request: PriceUpdateRequest = getPriceUpdateRequest(...protocolTokens);
  await updatePrices(request);
};
