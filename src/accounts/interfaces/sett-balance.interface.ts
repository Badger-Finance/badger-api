import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';

export interface SettBalance {
  id: string;
  name: string;
  asset: string;
  balance: number;
  value: number;
  tokens: TokenBalance[];
  earnedValue: number;
  earnedTokens: TokenBalance[];
}
