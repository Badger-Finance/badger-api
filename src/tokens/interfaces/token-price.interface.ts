/**
 * Detailed information on token price for both
 * USD and ETH base currencies.
 */
export interface TokenPrice {
  name: string;
  address: string;
  usd: number;
  eth: number;
}

/**
 * Mapping from token contract address to detailed
 * token price data.
 */
export interface PriceData {
  [address: string]: TokenPrice;
}

/**
 * Mapping from token contract address to single
 * currency price data.
 */
export interface PriceSummary {
  [address: string]: number;
}
