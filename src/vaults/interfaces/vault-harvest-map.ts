import { VaultDefinition } from './vault-definition.interface';
import { VaultHarvestsExtendedResp } from './vault-harvest-extended-resp.interface';

export interface VaultHarvestsMap {
  [address: VaultDefinition['vaultToken']]: VaultHarvestsExtendedResp[];
}
