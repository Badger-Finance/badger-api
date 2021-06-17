import { ValueSource } from '../../protocols/interfaces/value-source.interface';
import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';
import { SettSummary } from './sett-summary.interface';

export interface Sett extends SettSummary {
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
