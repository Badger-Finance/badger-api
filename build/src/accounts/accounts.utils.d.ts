import { Account, Currency, gqlGenT } from "@badger-dao/sdk";
import { CachedAccount } from "../aws/models/cached-account.model";
import { CachedBoost } from "../aws/models/cached-boost.model";
import { UserClaimSnapshot } from "../aws/models/user-claim-snapshot.model";
import { Chain } from "../chains/config/chain.config";
import { UserClaimMetadata } from "../rewards/entities/user-claim-metadata";
import { BoostData } from "../rewards/interfaces/boost-data.interface";
import { CachedSettBalance } from "./interfaces/cached-sett-balance.interface";
export declare function getBoostFile(chain: Chain): Promise<BoostData | null>;
export declare function getAccounts(chain: Chain): Promise<string[]>;
export declare function queryCachedAccount(address: string): Promise<CachedAccount>;
export declare function toVaultBalance(
  chain: Chain,
  vaultBalance: gqlGenT.UserSettBalanceFragment,
  currency?: Currency
): Promise<CachedSettBalance>;
export declare function getCachedBoost(chain: Chain, address: string): Promise<CachedBoost>;
export declare function getCachedAccount(chain: Chain, address: string): Promise<Account>;
export declare function getClaimableBalanceSnapshot(
  chain: Chain,
  address: string,
  startBlock: number
): Promise<UserClaimSnapshot>;
export declare function getLatestMetadata(chain: Chain): Promise<UserClaimMetadata>;
export declare function refreshAccountVaultBalances(chain: Chain, account: string): Promise<void>;
