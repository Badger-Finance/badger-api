export interface DebankUser {
  user_addr: string;
  rewards: {
    [token: string]: string;
  };
}
