import { Protocol, Token } from '@badger-dao/sdk';

export interface TreasuryPosition {
  token: Token;
  amount: number;
  value: number;
  protocol?: Protocol | string;
  apr: number;
}
