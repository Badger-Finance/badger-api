import { InternalServerError } from "@tsed/exceptions";
import { Token } from "../../interface/Token";
import { Service } from "@tsed/common";

/**
 * TODO: Integrate price service with token service,
 * introduce price field under token.
 * TODO: Allow bulk token look ups using parallel price
 * gathering / population of token prices.
 */
@Service()
export class TokenService {

  getTokenByName(token: string): Token {
    const knownToken = this.tokenRegistry.find(t => t.name === token);
    if (!knownToken) throw(new InternalServerError(`${token} definition not in TokenRegistry`));
    return knownToken;
  }

  getTokenByAddress(token: string): Token {
    const knownToken = this.tokenRegistry.find(t => t.address === token);
    if (!knownToken) throw(new InternalServerError(`${token} definition not in TokenRegistry`));
    return knownToken;
  }

  private tokenRegistry: Token[] = [

  ];
}
