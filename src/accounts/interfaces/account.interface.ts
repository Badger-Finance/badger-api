import { SettBalance } from './sett-balance.interface';

export interface Account {
  id: string;
  value: number;
  earnedValue: number;
  balances: SettBalance[];
}
