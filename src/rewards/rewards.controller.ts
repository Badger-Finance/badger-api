import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, PathParams, QueryParams } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { RewardsService } from './rewards.service';

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
  @(Returns(404).Description('User has no rewards proof available'))
  async getBadgerTreeReward(
    @PathParams('address') address: string,
    @QueryParams('chain') chain?: Network,
  ): Promise<RewardMerkleClaimModel> {
    return this.rewardsService.getUserRewards(Chain.getChain(chain), address);
  }
}
