import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
export declare function refreshApySnapshots(): Promise<string>;
export declare function refreshChainApySnapshots(chain: Chain, vault: VaultDefinitionModel): Promise<void>;
