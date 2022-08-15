import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { YieldSource } from "../../aws/models/yield-source.model";
import { Chain } from "../../chains/config/chain.config";
export declare class SwaprStrategy {
  static getValueSources(_chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]>;
}
