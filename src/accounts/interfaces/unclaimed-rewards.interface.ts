import { UserRewardsUnclaimed } from './user-rewards-unclaimed.interface';

export interface UnclaimedRewards {
  page: number;
  maxPage: number;
  rewards: UserRewardsUnclaimed;
}
