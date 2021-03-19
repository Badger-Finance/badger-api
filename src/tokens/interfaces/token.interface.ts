import { TokenType } from '../enums/token-type.enum';
import { WrappedToken } from './wrapped-token.interface';

export interface Token {
  address: string;
  decimals: number;
  lookupName?: string;
  lpToken?: boolean;
  name: string;
  symbol: string;
  type: TokenType;
  vaultToken?: WrappedToken;
}
