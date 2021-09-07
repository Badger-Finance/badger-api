import { SettState } from '../../config/enums/sett-state.enum';
import { ValueSource } from '../../protocols/interfaces/value-source.interface';
import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';
import { SettSummary } from './sett-summary.interface';

export interface Sett extends SettSummary {
  apr: number;
  asset: string;
  vaultAsset: string;
  boostable: boolean;
  deprecated: boolean;
  experimental: boolean;
  hasBouncer: boolean;
  maxApr?: number;
  minApr?: number;
  ppfs: number;
  sources: ValueSource[];
  state: SettState;
  tokens: TokenBalance[];
  underlyingToken: string;
  vaultToken: string;
}
