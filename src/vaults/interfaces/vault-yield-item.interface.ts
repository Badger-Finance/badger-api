import { VaultPerformanceEvent } from '@badger-dao/sdk';

import { YieldType } from '../enums/yield-type.enum';

export interface VaultYieldItem extends VaultPerformanceEvent {
  type: YieldType;
}
