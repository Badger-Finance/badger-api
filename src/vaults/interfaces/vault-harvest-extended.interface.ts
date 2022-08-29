import { VaultPerformanceEvent } from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldType } from '../enums/yield-type.enum';

export interface VaultHarvestsExtended extends Omit<VaultPerformanceEvent, 'amount'> {
  vault: VaultDefinitionModel['address'];
  eventType: YieldType;
  amount: number;
  strategyBalance?: number;
  estimatedApr?: number;
}
