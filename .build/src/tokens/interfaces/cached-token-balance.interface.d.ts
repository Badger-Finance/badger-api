import { TokenValue } from "@badger-dao/sdk";
export declare class CachedTokenBalance implements TokenValue {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  balance: number;
  value: number;
}
