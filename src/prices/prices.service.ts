import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { PriceSummary } from '../tokens/interfaces/token-price.interface';
import { getPriceData, inCurrency } from './prices.utils';

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
@Service()
export class PricesService {
  async getPriceSummary(chain: Chain, currency?: string): Promise<PriceSummary> {
    const priceData = await getPriceData(chain.tokens);
    const priceSummary: PriceSummary = {};
    for (const [key, value] of Object.entries(priceData)) {
      priceSummary[key] = inCurrency(value, currency);
    }
    return priceSummary;
  }
}
