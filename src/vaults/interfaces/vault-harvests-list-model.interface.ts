import { Description, Example } from '@tsed/schema';
import { VaultHarvestsMap } from './vault-harvest-map';
import { VaultDefinition } from './vault-definition.interface';
import { VaultHarvestsExtended } from './vault-harvest-extended';
import { vaultsHarvestsMapMock } from '../mocks/vaults-harvests-map.mock';

@Description('Harvests by vaults map')
@Example(vaultsHarvestsMapMock)
export class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinition['vaultToken']]: VaultHarvestsExtended[];
}
