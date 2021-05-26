import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';

export interface SettBalance {
  id: string;
  name: string;
  asset: string;
  balance: number;
  value: number;
  tokens: TokenBalance[];
  earnedBalance: number;
  earnedValue: number;
  earnedTokens: TokenBalance[];
}
