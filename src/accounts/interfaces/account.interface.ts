import { BoostMultipliers } from '../../rewards/interfaces/boost-multipliers.interface';
import { CachedBalance } from './cached-claimable-balance.interface';
import { SettBalance } from './sett-balance.interface';

export interface Account {
  address: string;
  boost: number;
  boostRank: number;
  multipliers: BoostMultipliers;
  value: number;
  earnedValue: number;
  balances: SettBalance[];
  claimableBalances: CachedBalance[];
  claimableBalancesMap: Record<string, string>;
  nativeBalance: number;
  nonNativeBalance: number;
}
