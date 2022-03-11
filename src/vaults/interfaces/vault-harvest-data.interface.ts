import { VaultHarvestEvent, VaultTreeDistributionEvent } from '@badger-dao/sdk';

export interface VaultHarvestData {
  timestamp: number;
  harvests: VaultHarvestEvent[];
  treeDistributions: VaultTreeDistributionEvent[];
}
