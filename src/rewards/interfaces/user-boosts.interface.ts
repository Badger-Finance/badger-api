import { UserBoostMultiplier } from './user-boost-multipliers.interface';

export interface UserBoosts {
  [address: string]: UserBoostMultiplier;
}
