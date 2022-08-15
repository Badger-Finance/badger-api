import { Currency } from "@badger-dao/sdk";
import { PriceSnapshots } from "../tokens/interfaces/price-snapshots.interface";
import { PriceSummary } from "../tokens/interfaces/price-summary.interface";
/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
export declare class PricesService {
  getPriceSummary(tokens: string[], currency?: Currency): Promise<PriceSummary>;
  getPriceSnapshots(tokens: string[], timestamps: number[], currency?: Currency): Promise<PriceSnapshots>;
}
