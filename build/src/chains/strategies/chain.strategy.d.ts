import { TokenPrice } from "../../prices/interface/token-price.interface";
import { Chain } from "../config/chain.config";
export declare abstract class ChainStrategy {
  private static strategies;
  static register(strategy: ChainStrategy, addresses: string[]): void;
  static getStrategy(chain: Chain, address: string): Promise<ChainStrategy>;
  abstract getPrice(address: string): Promise<TokenPrice>;
}
