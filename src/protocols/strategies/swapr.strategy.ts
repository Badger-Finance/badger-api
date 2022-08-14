import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { YieldSource } from "../../aws/models/yield-source.model";
import { Chain } from "../../chains/config/chain.config";
import { SWAPR_URL } from "../../config/constants";
import { getUniV2SwapValue } from "./strategy.utils";

export class SwaprStrategy {
  static async getValueSources(_chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]> {
    return Promise.all([getUniV2SwapValue(SWAPR_URL, vaultDefinition)]);
  }
}
