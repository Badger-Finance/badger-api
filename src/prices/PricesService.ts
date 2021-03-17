import { Service } from '@tsed/common';
import { Chain } from '../config/chain/chain';
import { PriceSummary } from '../tokens/interfaces/token-price.interface';
import { getPrice, getPriceData, inCurrency } from './prices-util';

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
@Service()
export class PricesService {
  /**
   * Retrieve the USD price for a given token balance.
   * @param contract Token contract address.
   * @param balance Token balance to calculate price.
   */
  async getUsdValue(contract: string, balance: number): Promise<number> {
    const tokenPrice = await getPrice(contract);
    return tokenPrice.usd * balance;
  }

  /**
   * Retrieve the ETH price for a given token balance.
   * @param contract Token contract address.
   * @param balance Token balance to calculate price.
   */
  async getEthValue(contract: string, balance: number): Promise<number> {
    const tokenPrice = await getPrice(contract);
    return tokenPrice.eth * balance;
  }

  async getPriceSummary(chain: Chain, currency?: string): Promise<PriceSummary> {
    const chainTokens = Object.keys(chain.tokens);
    const priceData = await getPriceData();
    const priceSummary: PriceSummary = {};
    const chainTokenPrices = Object.entries(priceData).filter(([key]) => chainTokens.includes(key));
    for (const [key, value] of chainTokenPrices) {
      priceSummary[key] = inCurrency(value, currency);
    }
    return priceSummary;
  }
}
