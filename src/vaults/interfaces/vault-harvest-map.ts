import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { VaultHarvestsExtendedResp } from "./vault-harvest-extended-resp.interface";

export interface VaultHarvestsMap {
  [address: VaultDefinitionModel["address"]]: VaultHarvestsExtendedResp[];
}
