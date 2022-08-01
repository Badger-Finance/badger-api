import { VaultPerformanceEvent } from '@badger-dao/sdk';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';

import { HarvestType } from '../enums/harvest.enum';

export interface VaultHarvestsExtended extends Omit<VaultPerformanceEvent, 'amount'> {
  vault: VaultDefinitionModel['address'];
  eventType: HarvestType;
  amount: number;
  strategyBalance?: number;
  estimatedApr?: number;
}
