import { Description, Example } from '@tsed/schema';
import { TOKENS } from '../../config/tokens.config';
import { PriceSummary } from './price-summary.interface';

/**
 * Mapping from token contract address to single
 * currency price data.
 */
@Description('Mapping of checksum contract address to currency value')
@Example({ [TOKENS.BADGER]: 10.34, [TOKENS.DIGG]: 41003.56, [TOKENS.XSUSHI]: 13.52, [TOKENS.WBTC]: 39023.12 })
export class PriceSummaryModel implements PriceSummary {
  [address: string]: number;
}
