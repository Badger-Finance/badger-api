import { Chain } from '../../chains/config/chain.config';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { TokenType } from '../enums/token-type.enum';
import { WrappedToken } from './wrapped-token.interface';

export interface Token {
  address: string;
  decimals: number;
  getPrice?: (chain: Chain, token: Token) => Promise<TokenPrice>;
  lookupName?: string;
  lpToken?: boolean;
  name: string;
  symbol: string;
  type: TokenType;
  vaultToken?: WrappedToken;
}
