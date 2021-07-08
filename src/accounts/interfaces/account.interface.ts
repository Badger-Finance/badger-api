import { BoostMultipliers } from '../../rewards/interfaces/boost-multipliers.interface';
import { CachedBalance } from './cached-claimable-balance.interface';
import { SettBalance } from './sett-balance.interface';

export interface Account {
  id: string;
  boost: number;
  boostRank: number;
  multipliers: BoostMultipliers;
  value: number;
  earnedValue: number;
  balances: SettBalance[];
  claimableBalances: CachedBalance[];
  nativeBalance: number;
  nonNativeBalance: number;
}
