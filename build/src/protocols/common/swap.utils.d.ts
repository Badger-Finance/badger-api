import { Chain } from "../../chains/config/chain.config";
import { TokenPrice } from "../../prices/interface/token-price.interface";
interface LiquidityData {
  contract: string;
  token0: string;
  token1: string;
  reserve0: number;
  reserve1: number;
  totalSupply: number;
}
export declare function getLiquidityData(chain: Chain, contract: string): Promise<LiquidityData>;
export declare const getOnChainLiquidityPrice: (chain: Chain, contract: string) => Promise<TokenPrice>;
export declare function resolveTokenPrice(chain: Chain, token: string, contract: string): Promise<TokenPrice>;
export {};
