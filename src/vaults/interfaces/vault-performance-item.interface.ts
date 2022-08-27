import { VaultPerformanceEvent } from '@badger-dao/sdk';

import { YieldType } from '../enums/yield-type.enum';

export interface VaultPerformanceItem extends VaultPerformanceEvent {
  type: YieldType;
}
