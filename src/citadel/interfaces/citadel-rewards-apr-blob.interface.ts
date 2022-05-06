import { CitadelRewardType } from '@badger-dao/sdk';

export interface CitadelRewardsAprBlob {
  overall: number;
  [CitadelRewardType.Citadel]: number;
  [CitadelRewardType.Funding]: number;
  [CitadelRewardType.Tokens]: number;
  [CitadelRewardType.Yield]: number;
}
