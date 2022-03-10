import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';

import { RewardsService } from './rewards.service';

import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { EmissionScheduleApi, RewardSchedulesByVaults } from './interfaces/reward-schedules-vault.interface';
import { RewardSchedulesByVaultModel } from './interfaces/reward-schedules-vault-model.interface';
import { RewardSchedulesByVaultsModel } from './interfaces/reward-schedules-vaults-model.interface';

@Controller('/reward')
export class RewardController {
  @Inject()
  rewardsService!: RewardsService;

  @Hidden()
  @Get('/bouncer/:address')
  @ContentType('json')
  async getBouncerProof(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<AirdropMerkleClaim> {
    return this.rewardsService.getBouncerProof(Chain.getChain(chain), address);
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
    return this.rewardsService.getUserRewards(Chain.getChain(chain), address);
  }

  @Get('/schedules/list')
  @ContentType('json')
  @Summary('Get all token rewards emmited for all vaults on network')
  @Description('Return emission schedule list for all vaults')
  @Returns(200, RewardSchedulesByVaultsModel)
  @Returns(404).Description('No rewards token emission data for network')
  async getRewardSchedulesVaultsList(@QueryParams('chain') chain?: Network): Promise<RewardSchedulesByVaults> {
    return this.rewardsService.rewardSchedulesVaultsList(Chain.getChain(chain));
  }

  @Get('/schedules/:address')
  @ContentType('json')
  @Summary('Get all token rewards emmited for vault on network')
  @Description('Return emission schedule list for specified vault')
  @Returns(200, Array).Of(RewardSchedulesByVaultModel)
  @Returns(404).Description('No rewards token emission data for network')
  @Returns(404).Description('Unknown vault')
  async getRewardListSchedulesForVault(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<EmissionScheduleApi[]> {
    return this.rewardsService.rewardSchedulesByVault(Chain.getChain(chain), address);
  }
}
