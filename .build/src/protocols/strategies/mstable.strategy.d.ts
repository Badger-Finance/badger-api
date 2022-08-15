import { Token } from "@badger-dao/sdk";
import { Chain } from "../../chains/config/chain.config";
import { TokenPrice } from "../../prices/interface/token-price.interface";
export declare function getImBtcPrice(chain: Chain, token: Token): Promise<TokenPrice>;
export declare function getMhBtcPrice(chain: Chain, token: Token): Promise<TokenPrice>;
