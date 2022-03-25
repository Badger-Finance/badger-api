import { VaultPerformanceEvent } from '@badger-dao/sdk';
import { HarvestType } from '../enums/harvest.enum';

export interface VaultHarvestsExtended extends VaultPerformanceEvent {
  eventType: HarvestType;
  strategyBalance?: number;
  estimatedApr?: number;
}
