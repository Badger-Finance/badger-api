import { TokenPrice } from './token-price.interface';

/**
 * Mapping from token contract address to detailed
 * token price data.
 */
export interface PriceData {
  [address: string]: TokenPrice;
}
