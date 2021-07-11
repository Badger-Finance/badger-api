import { BigNumber } from 'ethers';

export interface RewardMerkleClaim {
  index: BigNumber;
  cycle: BigNumber;
  boost: BigNumber;
  user: string;
  tokens: string[];
  cumulativeAmounts: BigNumber[];
  proof: string[];
  node: string;
}
