import { TokenBalance } from '../../tokens/interfaces/token-balance.interface';

export interface SettBalance {
  id: string;
  name: string;
  asset: string;
  balance: TokenBalance[];
  value: number;
  earnedTokens: TokenBalance[];
  earnedValue: number;
}
