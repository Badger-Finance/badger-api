import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { VaultHarvestsExtendedResp } from "./vault-harvest-extended-resp.interface";
import { VaultHarvestsMap } from "./vault-harvest-map";
export declare class VaultHarvestsMapModel implements VaultHarvestsMap {
  [address: VaultDefinitionModel["address"]]: VaultHarvestsExtendedResp[];
}
