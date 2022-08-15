import { Network } from "@badger-dao/sdk";
import { AirdropMerkleClaim } from "./interfaces/merkle-distributor.interface";
import { RewardMerkleClaimModel } from "./interfaces/reward-merkle-claim-model.interface";
import { EmissionSchedule, RewardSchedulesByVaults } from "./interfaces/reward-schedules-vault.interface";
import { RewardsService } from "./rewards.service";
export declare class RewardV2Controller {
  rewardsService: RewardsService;
  getBouncerProof(address: string, chain?: Network): Promise<AirdropMerkleClaim>;
  getBadgerTreeReward(address: string, chain?: Network): Promise<RewardMerkleClaimModel>;
  getRewardSchedulesVaultsList(chain?: Network, active?: boolean): Promise<RewardSchedulesByVaults>;
  getRewardListSchedulesForVault(address: string, chain?: Network, active?: boolean): Promise<EmissionSchedule[]>;
}
