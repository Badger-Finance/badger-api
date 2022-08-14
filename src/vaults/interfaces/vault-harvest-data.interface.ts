import { VaultPerformanceEvent } from "@badger-dao/sdk";

export interface VaultHarvestData {
  timestamp: number;
  harvests: VaultPerformanceEvent[];
  treeDistributions: VaultPerformanceEvent[];
}
