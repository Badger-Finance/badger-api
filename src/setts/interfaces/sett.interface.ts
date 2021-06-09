import { ValueSource } from '../../protocols/interfaces/value-source.interface';
import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';
import { SettAffiliateData } from './sett-affiliate-data.interface';
import { SettSummary } from './sett-summary.interface';

/**
 * Sett and geyser objects will be represented by the same
 * interface. The key difference between a sett and geyser
 * is the value sources which populate the entity. Geyser will
 * have emissions value sources while setts only have the
 * native underlying value source.
 */
export interface Sett extends SettSummary {
  affiliate?: SettAffiliateData;
  apr: number;
  asset: string;
  boostable: boolean;
  experimental: boolean;
  hasBouncer: boolean;
  maxApr?: number;
  minApr?: number;
  ppfs: number;
  sources: ValueSource[];
  tokens: TokenBalance[];
  underlyingToken: string;
  vaultToken: string;
}
