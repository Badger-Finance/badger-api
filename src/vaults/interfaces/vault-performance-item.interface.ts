import { HarvestType, VaultPerformanceEvent } from '@badger-dao/sdk';

export interface VaultPerformanceItem extends VaultPerformanceEvent {
  type: HarvestType;
}
