import { BigNumber } from 'ethers';

export interface AirdropMerkleDistribution {
  merkleRoot: string;
  tokenTotal: BigNumber;
  claims: Record<string, AirdropMerkleClaim>;
}

export interface AirdropMerkleClaim {
  index: number;
  amount: BigNumber;
  proof: string[];
}

export interface RewardMerkleDistribution {
  merkleRoot: string;
  tokenTotal: Record<string, BigNumber>;
  claims: Record<string, RewardMerkleClaim>;
}

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
