import { BoostMultipliers } from './boost-multipliers.interface';

export interface Boost {
  boost: number;
  stakeRatio: number;
  multipliers: BoostMultipliers;
}
