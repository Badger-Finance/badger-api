import { TokenType } from '../enums/token-type.enum';

export interface Token {
  address: string;
  decimals: number;
  name: string;
  symbol: string;
  type: TokenType;
  lpToken?: boolean;
  lookupName?: string;
}
