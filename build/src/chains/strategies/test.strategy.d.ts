import { TokenPrice } from "../../prices/interface/token-price.interface";
import { ChainStrategy } from "./chain.strategy";
export declare class TestStrategy extends ChainStrategy {
  constructor();
  getPrice(address: string): Promise<TokenPrice>;
  randomPrice(min?: number, max?: number): number;
}
