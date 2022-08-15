import { CachedTokenBalance } from "../../tokens/interfaces/cached-token-balance.interface";
export declare class CachedSettBalance {
  network: string;
  address: string;
  name: string;
  symbol: string;
  pricePerFullShare: number;
  balance: number;
  value: number;
  tokens: CachedTokenBalance[];
  earnedBalance: number;
  earnedValue: number;
  earnedTokens: CachedTokenBalance[];
  depositedBalance: number;
  withdrawnBalance: number;
}
