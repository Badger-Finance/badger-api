import { VaultPerformanceEvent } from '@badger-dao/sdk';
import { HarvestType } from '../enums/harvest.enum';
import { VaultDefinition } from './vault-definition.interface';

export interface VaultHarvestsExtended extends VaultPerformanceEvent {
  vault: VaultDefinition['vaultToken'];
  eventType: HarvestType;
  strategyBalance?: number;
  estimatedApr?: number;
}
