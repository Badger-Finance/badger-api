import { SettState } from '../../config/enums/sett-state.enum';
import { ValueSource } from '../../protocols/interfaces/value-source.interface';
import { BouncerType } from '../../rewards/enums/bouncer-type.enum';
import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';
import { SettBoost } from './sett-boost.interface';
import { SettSummary } from './sett-summary.interface';

export interface Sett extends SettSummary {
  apr: number;
  asset: string;
  vaultAsset: string;
  boostable: boolean;
  deprecated: boolean;
  experimental: boolean;
  bouncer: BouncerType;
  maxApr?: number;
  minApr?: number;
  ppfs: number;
  sources: ValueSource[];
  state: SettState;
  tokens: TokenBalance[];
  underlyingToken: string;
  vaultToken: string;
  multipliers: SettBoost[];
}
