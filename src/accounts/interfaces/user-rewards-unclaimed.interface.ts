import { CachedBalance } from './cached-claimable-balance.interface';

export interface UserRewardsUnclaimed {
  [address: string]: CachedBalance[];
}
