import { BoostMultipliers } from './boost-multipliers.interface';

export interface Boost {
  boost: number;
  stakeRatio: number;
  nftMultiplier: number;
  multipliers: BoostMultipliers;
  nativeBalance: number;
  nonNativeBalance: number;
}
