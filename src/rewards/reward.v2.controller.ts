import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams, UseCache } from '@tsed/common';
import { ContentType, Deprecated, Description, Hidden, Returns, Summary } from '@tsed/schema';

import { getOrCreateChain } from '../chains/chains.utils';
import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { EmissionSchedule, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
import { RewardSchedulesByVaultModel } from './interfaces/reward-schedules-vault-model.interface';
import { RewardSchedulesByVaultsModel } from './interfaces/reward-schedules-vaults-model.interface';
import { RewardsService } from './rewards.service';

@Deprecated()
@Controller('/reward')
export class RewardV2Controller {
  @Inject()
  rewardsService!: RewardsService;

  @Hidden()
  @Get('/bouncer/:address')
  @ContentType('json')
  async getBouncerProof(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<AirdropMerkleClaim> {
    return this.rewardsService.getBouncerProof(getOrCreateChain(chain), address);
  }

  @Get('/tree/:address')
  @ContentType('json')
  @Summary("Get an account's reward proof")
  @Description('Return user badger tree reward proof')
  @Returns(200, RewardMerkleClaimModel)
  @Returns(404).Description('User has no rewards proof available')
  async getBadgerTreeReward(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<RewardMerkleClaimModel> {
    return this.rewardsService.getUserRewards(getOrCreateChain(chain), address);
  }

  @UseCache()
  @Get('/schedules')
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

  @UseCache()
  @Get('/schedules/:address')
  @ContentType('json')
  @Summary('Get all token rewards emmited for vault on network')
  @Description('Return emission schedule list for specified vault')
  @Returns(200, Array).Of(RewardSchedulesByVaultModel)
  @Returns(404).Description('Unknown vault')
  async getRewardListSchedulesForVault(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
    @QueryParams('active') active?: boolean,
  ): Promise<EmissionSchedule[]> {
    return this.rewardsService.rewardSchedulesByVault(getOrCreateChain(chain), address, Boolean(active));
  }
}
