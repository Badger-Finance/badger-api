import { Token } from "@badger-dao/sdk";
import { VaultDefinitionModel } from "../../aws/models/vault-definition.model";
import { VaultTokenBalance } from "../../aws/models/vault-token-balance.model";
import { YieldSource } from "../../aws/models/yield-source.model";
import { Chain } from "../../chains/config/chain.config";
import { TokenPrice } from "../../prices/interface/token-price.interface";
import { CachedTokenBalance } from "../../tokens/interfaces/cached-token-balance.interface";
export declare class BalancerStrategy {
  static getValueSources(vault: VaultDefinitionModel): Promise<YieldSource[]>;
}
export declare function getBPTPrice(chain: Chain, token: string): Promise<TokenPrice>;
export declare function getBalancerPoolTokens(chain: Chain, token: string): Promise<CachedTokenBalance[]>;
export declare function getBalancerVaultTokenBalance(chain: Chain, token: string): Promise<VaultTokenBalance>;
export declare function resolveBalancerPoolTokenPrice(chain: Chain, token: Token, pool?: string): Promise<TokenPrice>;
export declare function getBalancerSwapFees(vault: VaultDefinitionModel): Promise<YieldSource[]>;
