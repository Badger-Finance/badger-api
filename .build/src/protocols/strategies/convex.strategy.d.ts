import { Token } from '@badger-dao/sdk';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../../aws/models/vault-token-balance.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { Chain } from '../../chains/config/chain.config';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
export declare const CURVE_API_URL = "https://stats.curve.fi/raw-stats/apys.json";
export declare const CURVE_CRYPTO_API_URL = "https://stats.curve.fi/raw-stats-crypto/apys.json";
export declare const CURVE_MATIC_API_URL = "https://stats.curve.fi/raw-stats-polygon/apys.json";
export declare const CURVE_ARBITRUM_API_URL = "https://stats.curve.fi/raw-stats-arbitrum/apys.json";
export declare const CURVE_FACTORY_APY = "https://api.curve.fi/api/getFactoryAPYs";
export declare const CURVE_BASE_REGISTRY = "0x0000000022D53366457F9d5E68Ec105046FC4383";
export declare const HARVEST_FORWARDER = "0xA84B663837D94ec41B0f99903f37e1d69af9Ed3E";
export declare const BRIBES_PROCESSOR = "0xb2Bf1d48F2C2132913278672e6924efda3385de2";
export declare const OLD_BRIBES_PROCESSOR = "0xbeD8f323456578981952e33bBfbE80D23289246B";
export declare class ConvexStrategy {
    static getValueSources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource[]>;
}
export declare function getCurvePerformance(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<YieldSource>;
export declare function getCurveTokenPrice(chain: Chain, depositToken: string): Promise<TokenPrice>;
export declare function getCurvePoolBalance(chain: Chain, depositToken: string): Promise<CachedTokenBalance[]>;
export declare function getCurveVaultTokenBalance(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<VaultTokenBalance>;
export declare function resolveCurvePoolTokenPrice(chain: Chain, token: Token): Promise<TokenPrice>;
export declare function resolveCurveStablePoolTokenPrice(chain: Chain, token: Token): Promise<TokenPrice>;
