import { ConditionExpression } from '@aws/dynamodb-expressions';
import { Service } from '@tsed/common';
import { ethers } from 'ethers';

import { getLatestMetadata } from '../accounts/accounts.utils';
import { getDataMapper } from '../aws/dynamodb.utils';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { getTreeDistribution } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { DEFAULT_PAGE_SIZE } from '../config/constants';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { NodataForVaultError } from '../errors/allocation/nodata.for.vault.error';
import { UnsupportedChainError } from '../errors/validation/unsupported.chain.error';
import { RewardMerkleClaim } from './interfaces/reward-merkle-claim.interface';
import { EmissionSchedule, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';

@Service()
export class RewardsService {
  /**
   * Get badger tree reward merkle claim for a user.
   * @param address User Ethereum address.
   */
  async getUserRewards(chain: Chain, address: string): Promise<RewardMerkleClaim> {
    const userAddress = ethers.utils.getAddress(address);
    const treeDistribution = await getTreeDistribution(chain);
    if (!treeDistribution) {
      throw new UnsupportedChainError(`${chain.network}`);
    }
    const claim = treeDistribution.claims[userAddress];
    if (!claim) {
      throw new NodataForAddrError(`${userAddress}`);
    }
    return claim;
  }

  async list({
    chain,
    pageNum = 0,
    pageCount = DEFAULT_PAGE_SIZE,
  }: {
    chain: Chain;
    pageNum?: number;
    pageCount?: number;
  }): Promise<{
    count: number;
    records: UserClaimSnapshot[];
  }> {
    const { chainStartBlock, count } = await getLatestMetadata(chain);
    const mapper = getDataMapper();
    const records = [];
    const startingPageId = pageNum * pageCount;
    const endingPageId = startingPageId + pageCount - 1;
    const expression: ConditionExpression = {
      type: 'Between',
      subject: 'pageId',
      lowerBound: startingPageId,
      upperBound: endingPageId,
    };
    for await (const entry of mapper.query(UserClaimSnapshot, { chainStartBlock }, { filter: expression })) {
      records.push(entry);
    }
    return {
      count,
      records: records.sort((record) => record.pageId),
    };
  }

  /**
   * Get all token rewards emmited, by vault
   * @param chain Network chain obj
   * @param address Vault token adress
   * @param active Vault end date is not passed
   */
  async rewardSchedulesByVault(chain: Chain, address: string, active: boolean): Promise<EmissionSchedule[]> {
    const chainSdk = await chain.getSdk();
    try {
      const vault = await chain.vaults.getVault(address);
      const loadMethod = active ? 'loadActiveSchedules' : 'loadSchedules';
      return chainSdk.rewards[loadMethod](vault.address);
    } catch (err) {
      throw new NodataForVaultError(address);
    }
  }

  /**
   * Get all token rewards emmited, by all vaults
   * @param chain Network chain obj
   * @param active Vault end date is not passed
   */
  async rewardSchedulesVaultsList(chain: Chain, active: boolean): Promise<RewardSchedulesByVaults> {
    const chainSdk = await chain.getSdk();
    const vaults = await chain.vaults.all();

    const vaultsSchedules = await Promise.all(
      vaults.map(async (vault) => {
        if (!vault.address) return [];

        const loadMethod = active ? 'loadActiveSchedules' : 'loadSchedules';

        return chainSdk.rewards[loadMethod](vault.address);
      }),
    );

    return vaultsSchedules.reduce((acc: RewardSchedulesByVaults, vaultSchedules) => {
      if (!vaultSchedules || vaultSchedules?.length === 0) return acc;

      const [firstVaultSchedule] = vaultSchedules;

      acc[firstVaultSchedule.beneficiary] = vaultSchedules;

      return acc;
    }, {});
  }
}
