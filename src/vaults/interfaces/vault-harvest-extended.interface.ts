import { VaultPerformanceEvent } from '@badger-dao/sdk';
import { HarvestType } from '../enums/harvest.enum';
import { VaultDefinition } from './vault-definition.interface';

export interface VaultHarvestsExtended extends Omit<VaultPerformanceEvent, 'amount'> {
  vault: VaultDefinition['vaultToken'];
  eventType: HarvestType;
  amount: number;
  strategyBalance?: number;
  estimatedApr?: number;
}
