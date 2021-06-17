import { BoostMultipliers } from '../../rewards/interfaces/boost-multipliers.interface';
import { SettBalance } from './sett-balance.interface';

export interface Account {
  id: string;
  boost: number;
  boostRank: number;
  multipliers: BoostMultipliers;
  value: number;
  earnedValue: number;
  balances: SettBalance[];
}
