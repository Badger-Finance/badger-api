import { VaultPerformanceEvent, YieldType } from '@badger-dao/sdk';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';

export interface VaultHarvestsExtended extends Omit<VaultPerformanceEvent, 'amount'> {
  vault: VaultDefinitionModel['address'];
  eventType: YieldType;
  amount: number;
  strategyBalance?: number;
  estimatedApr?: number;
}
