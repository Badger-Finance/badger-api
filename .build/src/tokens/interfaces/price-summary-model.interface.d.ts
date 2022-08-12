import { PriceSummary } from './price-summary.interface';
/**
 * Mapping from token contract address to single
 * currency price data.
 */
export declare class PriceSummaryModel implements PriceSummary {
    [address: string]: number;
}
