import { BigNumber } from 'ethers';
import { RewardMerkleClaim } from './reward-merkle-claim.interface';

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
