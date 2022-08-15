import { Network } from "@badger-dao/sdk";
import { TokenPrice } from "../../prices/interface/token-price.interface";
import { ChainStrategy } from "./chain.strategy";
export declare class BaseStrategy extends ChainStrategy {
  private network;
  constructor(network: Network, tokens: string[]);
  getPrice(address: string): Promise<TokenPrice>;
}
