import { Description, Example } from '@tsed/schema';

import { vaultsHarvestsMapMock } from '../mocks/vaults-harvests-map.mock';
import { VaultDefinition } from './vault-definition.interface';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './vault-harvest-map';

@Description('Harvests by vaults map')
@Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinition['vaultToken']]: VaultHarvestsExtendedResp[];
}
