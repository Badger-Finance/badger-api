import { Network } from '@badger-dao/sdk';
import { Controller, Inject } from '@tsed/di';
import { UseCache } from '@tsed/platform-cache';
import { QueryParams } from '@tsed/platform-params';
import { ContentType, Description, Get, Returns, Summary } from '@tsed/schema';
import { ethers } from 'ethers';

import { getOrCreateChain } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { DEFAULT_PAGE_SIZE } from '../config/constants';
import { QueryParamError } from '../errors/validation/query.param.error';
import { ListRewardsResponse } from './interfaces/list-rewards-response.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { EmissionSchedule, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
import { RewardSchedulesByVaultModel } from './interfaces/reward-schedules-vault-model.interface';
import { RewardSchedulesByVaultsModel } from './interfaces/reward-schedules-vaults-model.interface';
import { RewardsService } from './rewards.service';
import { userClaimedSnapshotToDebankUser } from './rewards.utils';

@Controller('/rewards')
export class RewardsV3Controller {
  @Inject()
  rewardsService!: RewardsService;

  @Get('/list')
  @ContentType('json')
  @Summary('List the unclaimable reward balances')
  @Description('Returns a paginated chunk of reward balance snapshots for users')
  @Returns(200)
  async list(
    @QueryParams('chain_id') chainId?: string,
    @QueryParams('page_num') pageNum?: number,
    @QueryParams('page_count') pageCount?: number,
  ): Promise<ListRewardsResponse> {
    const chain = Chain.getChainById(chainId);
    const { count, records } = await this.rewardsService.list({ chain, pageNum, pageCount });
    return {
      total_count: count,
      total_page_num: Math.ceil(count / (pageCount || DEFAULT_PAGE_SIZE)),
      users: await Promise.all(records.map((record) => userClaimedSnapshotToDebankUser(chain, record))),
    };
  }

  @Get('/tree')
  @ContentType('json')
  @Summary("Get an account's reward proof")
  @Description('Return user badger tree reward proof')
  @Returns(200, RewardMerkleClaimModel)
  @Returns(404).Description('User has no rewards proof available')
  async getBadgerTreeReward(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<RewardMerkleClaimModel> {
    if (!address) {
      throw new QueryParamError('address');
    }
    return this.rewardsService.getUserRewards(getOrCreateChain(chain), ethers.utils.getAddress(address));
  }

  @UseCache()
  @Get('/schedules')
  @ContentType('json')
  @Summary('Get all token rewards emmited for vault on network')
  @Description('Return emission schedule list for specified vault')
  @Returns(200, Array).Of(RewardSchedulesByVaultModel)
  @Returns(404).Description('Unknown vault')
  async getRewardListSchedulesForVault(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('active') active?: boolean,
  ): Promise<EmissionSchedule[]> {
    if (!address) {
      throw new QueryParamError('address');
    }
    return this.rewardsService.rewardSchedulesByVault(getOrCreateChain(chain), address, Boolean(active));
  }

  @UseCache()
  @Get('/schedules/list')
  @ContentType('json')
  @Summary('Get all token rewards emmited for all vaults on network')
  @Description('Return emission schedule list for all vaults')
  @Returns(200, RewardSchedulesByVaultsModel)
  async getRewardSchedulesVaultsList(
    @QueryParams('chain') chain?: Network,
    @QueryParams('active') active?: boolean,
  ): Promise<RewardSchedulesByVaults> {
    return this.rewardsService.rewardSchedulesVaultsList(getOrCreateChain(chain), Boolean(active));
  }
}
