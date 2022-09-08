import { Description } from '@tsed/schema';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultHarvestsMap } from './vault-harvest-map';
import { YieldEventV2 } from './yield-event-v2.interface';

@Description('Harvests by vaults map')
// TODO: cannot address test code in external facing places (or sdk-mocks!)
// @Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinitionModel['address']]: YieldEventV2[];
}
