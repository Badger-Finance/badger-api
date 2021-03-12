export interface UserAccount {
  id: string;
  value: number;
  earnedValue: number;
  settAccounts: SettBalance[];
}

export interface SettBalance {
  id: string;
  name: string;
  asset: string;
  // balance: TokenBalance[],
  value: number;
  // earnedTokens: TokenBalance[],
  earnedValue: number;
}
