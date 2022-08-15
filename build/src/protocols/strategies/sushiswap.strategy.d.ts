import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { YieldSource } from "../../aws/models/yield-source.model";
import { Chain } from "../../chains/config/chain.config";
export declare class SushiswapStrategy {
  static getValueSources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]>;
}
export declare function getSushiSwapValue(
  vaultDefinition: VaultDefinitionModel,
  graphUrl: string
): Promise<YieldSource>;
