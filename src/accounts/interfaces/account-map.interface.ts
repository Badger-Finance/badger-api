import { CachedAccount } from './cached-account.interface';

export interface AccountMap {
  [address: string]: CachedAccount;
}
