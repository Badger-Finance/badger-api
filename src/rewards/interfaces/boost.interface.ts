export interface Boost {
  boost: number;
  stakeRatio: number;
  nftMultiplier: number;
  multipliers: Record<string, number>;
  nativeBalance: number;
  nonNativeBalance: number;
}
