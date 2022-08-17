import { Description } from '@tsed/schema';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './vault-harvest-map';

@Description('Harvests by vaults map')
// TODO: cannot address test code in external facing places (or sdk-mocks!)
// @Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinitionModel['address']]: VaultHarvestsExtendedResp[];
}
