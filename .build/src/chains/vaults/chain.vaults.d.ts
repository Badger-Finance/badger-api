import { Network } from "@badger-dao/sdk";
import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
export declare class ChainVaults {
  #private;
  network: Network;
  cachedVaults: VaultDefinitionModel[];
  readonly cacheTtl: number;
  private updatedAt;
  constructor(network: Network);
  all(): Promise<VaultDefinitionModel[]>;
  getVault(address: string): Promise<VaultDefinitionModel>;
}
