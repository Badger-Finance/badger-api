export interface RewardMerkleClaim {
  index: string;
  cycle: string;
  user: string;
  tokens: string[];
  cumulativeAmounts: string[];
  proof: string[];
  node: string;
}
