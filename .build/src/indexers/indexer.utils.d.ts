import { gqlGenT, RegistryVault, VaultSnapshot } from "@badger-dao/sdk";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { VaultTokenBalance } from "../aws/models/vault-token-balance.model";
import { Chain } from "../chains/config/chain.config";
import { Nullable } from "../utils/types.utils";
export declare function vaultToSnapshot(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<VaultSnapshot>;
export declare function constructVaultDefinition(
  chain: Chain,
  vault: RegistryVault
): Promise<Nullable<VaultDefinitionModel>>;
export declare function getLpTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<VaultTokenBalance>;
export declare function getVault(chain: Chain, contract: string, block?: number): Promise<gqlGenT.SettQuery>;
