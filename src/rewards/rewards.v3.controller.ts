import { formatBalance, Network } from '@badger-dao/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Controller, Get, Inject, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';
import { ethers } from 'ethers';

import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { DEFAULT_PAGE_SIZE } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { QueryParamError } from '../errors/validation/query.param.error';
import { getFullToken } from '../tokens/tokens.utils';
import { DebankUser } from './interfaces/debank-user.interface';
import { ListRewardsResponse } from './interfaces/list-rewards-response.interface';
import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { EmissionSchedule, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
import { RewardSchedulesByVaultModel } from './interfaces/reward-schedules-vault-model.interface';
import { RewardSchedulesByVaultsModel } from './interfaces/reward-schedules-vaults-model.interface';
import { RewardsService } from './rewards.service';
import { DIGG_SHARE_PER_FRAGMENT } from './rewards.utils';

@Controller('/rewards')
export class RewardsV3Controller {
  @Inject()
  rewardsService!: RewardsService;

  @Hidden()
  @Get('/bouncer')
  @ContentType('json')
  async getBouncerProof(
    @QueryParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<AirdropMerkleClaim> {
    if (!address) throw new QueryParamError('address');

    return this.rewardsService.getBouncerProof(Chain.getChain(chain), ethers.utils.getAddress(address));
  }

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
      users: await Promise.all(records.map((record) => this.userClaimedSnapshotToDebankUser(chain, record))),
    };
  }

  private async userClaimedSnapshotToDebankUser(chain: Chain, snapshot: UserClaimSnapshot): Promise<DebankUser> {
    const rewards: Record<string, number> = {};
    for (const record of snapshot.claimableBalances) {
      const { address, balance } = record;
      const token = await getFullToken(chain, address);
      if (token.address === TOKENS.DIGG) {
        rewards[address] = formatBalance(BigNumber.from(balance).div(DIGG_SHARE_PER_FRAGMENT), token.decimals);
      } else {
        rewards[address] = formatBalance(balance, token.decimals);
      }
    }
    return {
      user_addr: snapshot.address,
      rewards,
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
    if (!address) throw new QueryParamError('address');

    return this.rewardsService.getUserRewards(Chain.getChain(chain), ethers.utils.getAddress(address));
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
    if (!address) throw new QueryParamError('address');

    return this.rewardsService.rewardSchedulesByVault(Chain.getChain(chain), address, Boolean(active));
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
    return this.rewardsService.rewardSchedulesVaultsList(Chain.getChain(chain), Boolean(active));
  }
}
