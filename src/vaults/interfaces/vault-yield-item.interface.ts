import { VaultPerformanceEvent, YieldType } from '@badger-dao/sdk';

export interface VaultYieldItem extends VaultPerformanceEvent {
  type: YieldType;
}
