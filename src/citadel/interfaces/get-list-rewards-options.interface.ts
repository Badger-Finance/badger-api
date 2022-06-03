import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';

export interface GetListRewardsOptions {
  token?: string;
  account?: string;
  epoch?: number;
  filter: RewardFilter;
}
