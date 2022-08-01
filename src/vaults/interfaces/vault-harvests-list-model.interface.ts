import { Description, Example } from '@tsed/schema';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';

import { vaultsHarvestsMapMock } from '../mocks/vaults-harvests-map.mock';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './vault-harvest-map';

@Description('Harvests by vaults map')
@Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinitionModel['address']]: VaultHarvestsExtendedResp[];
}
