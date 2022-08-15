import { Account, VaultData } from "@badger-dao/sdk";
export declare class AccountModel implements Account {
  address: string;
  boost: number;
  boostRank: number;
  value: number;
  earnedValue: number;
  data: Record<string, VaultData>;
  claimableBalances: Record<string, string>;
  stakeRatio: number;
  nftBalance: number;
  bveCvxBalance: number;
  diggBalance: number;
  nativeBalance: number;
  nonNativeBalance: number;
  constructor(account: Account);
}
