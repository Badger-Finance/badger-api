import { UserBoostData } from "@badger-dao/sdk";
export declare class CachedBoost implements UserBoostData {
  leaderboard: string;
  boostRank: number;
  address: string;
  boost: number;
  stakeRatio: number;
  nftBalance: number;
  bveCvxBalance: number;
  diggBalance: number;
  nativeBalance: number;
  nonNativeBalance: number;
  updatedAt: number;
}
