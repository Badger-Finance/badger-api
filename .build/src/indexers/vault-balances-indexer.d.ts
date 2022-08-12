import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
export declare function refreshVaultBalances(): Promise<string>;
export declare function updateVaultTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<void>;
