import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaim } from './interfaces/reward-merkle-claim.interface';
import { EmissionSchedule, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
export declare class RewardsService {
    /**
     * Get airdrop merkle claim for a user.
     * @param airdrop Airdrop JSON filename.
     * @param address User Ethereum address.
     */
    getBouncerProof(chain: Chain, address: string): Promise<AirdropMerkleClaim>;
    /**
     * Get badger tree reward merkle claim for a user.
     * @param address User Ethereum address.
     */
    getUserRewards(chain: Chain, address: string): Promise<RewardMerkleClaim>;
    list({ chain, pageNum, pageCount, }: {
        chain: Chain;
        pageNum?: number;
        pageCount?: number;
    }): Promise<{
        count: number;
        records: UserClaimSnapshot[];
    }>;
    /**
     * Get all token rewards emmited, by vault
     * @param chain Network chain obj
     * @param address Vault token adress
     * @param active Vault end date is not passed
     */
    rewardSchedulesByVault(chain: Chain, address: string, active: boolean): Promise<EmissionSchedule[]>;
    /**
     * Get all token rewards emmited, by all vaults
     * @param chain Network chain obj
     * @param active Vault end date is not passed
     */
    rewardSchedulesVaultsList(chain: Chain, active: boolean): Promise<RewardSchedulesByVaults>;
}
