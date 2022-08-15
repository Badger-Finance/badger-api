import { CachedTokenBalance } from "../../tokens/interfaces/cached-token-balance.interface";
export declare class VaultPendingHarvestData {
  vault: string;
  yieldTokens: Array<CachedTokenBalance>;
  harvestTokens: Array<CachedTokenBalance>;
  previousYieldTokens: Array<CachedTokenBalance>;
  previousHarvestTokens: Array<CachedTokenBalance>;
  duration: number;
  lastMeasuredAt: number;
  lastHarvestedAt: number;
  lastReportedAt: number;
}
