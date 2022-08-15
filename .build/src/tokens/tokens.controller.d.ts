import { Network } from "@badger-dao/sdk";
import { TokenFullMap } from "./interfaces/token-full.interface";
export declare class TokensController {
  getTokens(chain?: Network): Promise<TokenFullMap>;
}
