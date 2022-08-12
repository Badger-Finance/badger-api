import { RewardMerkleClaim } from './reward-merkle-claim.interface';
export declare class RewardMerkleClaimModel implements RewardMerkleClaim {
    index: string;
    cycle: string;
    user: string;
    tokens: string[];
    cumulativeAmounts: string[];
    proof: string[];
    node: string;
    constructor(claim: RewardMerkleClaim);
}
