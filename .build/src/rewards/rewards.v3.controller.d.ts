import { Network } from "@badger-dao/sdk";
import { ListRewardsResponse } from "./interfaces/list-rewards-response.interface";
import { AirdropMerkleClaim } from "./interfaces/merkle-distributor.interface";
import { RewardMerkleClaimModel } from "./interfaces/reward-merkle-claim-model.interface";
import { EmissionSchedule, RewardSchedulesByVaults } from "./interfaces/reward-schedules-vault.interface";
import { RewardsService } from "./rewards.service";
export declare class RewardsV3Controller {
  rewardsService: RewardsService;
  getBouncerProof(address: string, chain?: Network): Promise<AirdropMerkleClaim>;
  list(chainId?: string, pageNum?: number, pageCount?: number): Promise<ListRewardsResponse>;
  private userClaimedSnapshotToDebankUser;
  getBadgerTreeReward(address: string, chain?: Network): Promise<RewardMerkleClaimModel>;
  getRewardListSchedulesForVault(address: string, chain?: Network, active?: boolean): Promise<EmissionSchedule[]>;
  getRewardSchedulesVaultsList(chain?: Network, active?: boolean): Promise<RewardSchedulesByVaults>;
}
