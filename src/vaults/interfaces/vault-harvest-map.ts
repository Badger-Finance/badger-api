import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldEventV2 } from './yield-event-v2.interface';

export interface VaultHarvestsMap {
  [address: VaultDefinitionModel['address']]: YieldEventV2[];
}
