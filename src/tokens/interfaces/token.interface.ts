import { Chain } from '../../chains/config/chain.config';
import { TokenType } from '../enums/token-type.enum';
import { TokenPrice } from './token-price.interface';
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
