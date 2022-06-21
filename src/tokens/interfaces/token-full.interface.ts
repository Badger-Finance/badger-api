import { Token } from '@badger-dao/sdk';

import { TokenConfigBody } from './token-config.interface';

export type TokenFull = TokenConfigBody & Token;

export interface TokenFullMap {
  [address: Token['address']]: TokenFull;
}
