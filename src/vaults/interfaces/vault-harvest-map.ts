import { VaultDefinition } from './vault-definition.interface';
import { VaultHarvestsExtended } from './vault-harvest-extended';

export interface VaultHarvestsMap {
  [address: VaultDefinition['vaultToken']]: VaultHarvestsExtended[];
}
