import { Description, Example } from '@tsed/schema';
import { VaultHarvestsMap } from './vault-harvest-map';
import { VaultDefinition } from './vault-definition.interface';
import { vaultsHarvestsMapMock } from '../mocks/vaults-harvests-map.mock';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';

@Description('Harvests by vaults map')
@Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinition['vaultToken']]: VaultHarvestsExtendedResp[];
}
