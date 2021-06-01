import { Token } from './token.interface';

export interface TokenConfig {
  [address: string]: Token;
}
