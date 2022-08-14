import { BigNumberish } from "ethers";

import { RewardMerkleClaim } from "./reward-merkle-claim.interface";

export interface AirdropMerkleDistribution {
  merkleRoot: string;
  tokenTotal: BigNumberish;
  claims: Record<string, AirdropMerkleClaim>;
}

export interface AirdropMerkleClaim {
  index: number;
  amount: BigNumberish;
  proof: string[];
}

export interface RewardMerkleDistribution {
  merkleRoot: string;
  cycle: number;
  tokenTotal: Record<string, BigNumberish>;
  claims: Record<string, RewardMerkleClaim>;
}
