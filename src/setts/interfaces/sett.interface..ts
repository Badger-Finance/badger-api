import { Geyser } from '../../interface/Geyser';
import { TokenBalance } from '../../interface/TokenBalance';
import { ValueSource } from '../../protocols/interfaces/value-source.interface';
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
  asset: string;
  apy: number;
  geyser?: Geyser;
  hasBouncer: boolean;
  ppfs: number;
  sources: ValueSource[];
  tokens: TokenBalance[];
  underlyingToken: string;
  vaultToken: string;
  affiliate?: SettAffiliateData;
}
