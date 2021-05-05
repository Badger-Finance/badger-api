import { BoostMultipliers } from '../../rewards/interfaces/boost-multipliers.interface';
import { AccountLimits } from './account-limits.interface';
import { SettBalance } from './sett-balance.interface';

export interface Account {
  id: string;
  boost: number;
  multipliers: BoostMultipliers;
  depositLimits: AccountLimits;
  // currently unused below
  value: number;
  earnedValue: number;
  balances: SettBalance[];
}
