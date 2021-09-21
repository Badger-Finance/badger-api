import { UserRewardsUnclaimed } from './user-rewards-unclaimed.interface';

export interface UnclaimedRewards {
  page: number;
  rewards: UserRewardsUnclaimed;
}
