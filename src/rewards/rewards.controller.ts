import { Controller, Get, Inject, PathParams } from '@tsed/common';
import { ContentType, Description, Hidden, Returns, Summary } from '@tsed/schema';
import { Eligibility } from './interfaces/eligibility.interface';
import { AirdropMerkleClaim } from './interfaces/merkle-distributor.interface';
import { RewardMerkleClaimModel } from './interfaces/reward-merkle-claim-model.interface';
import { RewardsService } from './rewards.service';

@Controller('/reward')
export class RewardController {
  @Inject()
  rewardsService!: RewardsService;

  // @Hidden()
  // @ContentType('json')
  // @Get('/gitcoin/:address')
  // async getGitcoinAirdropClaim(@PathParams('address') address: string): Promise<AirdropMerkleClaim> {
  //   return this.rewardsService.getUserAirdrop('gitcoin-airdrop.json', address);
  // }

  @Hidden()
  @Get('/bouncer/:address')
  @ContentType('json')
  async getBouncerProof(@PathParams('address') address: string): Promise<AirdropMerkleClaim> {
    return this.rewardsService.getBouncerProof(address);
  }

  @Get('/tree/:address')
  @ContentType('json')
  @Summary("Get an account's reward proof")
  @Description('Return user badger tree reward proof')
  @Returns(200, RewardMerkleClaimModel)
  @(Returns(404).Description('User has no rewards proof available'))
  async getBadgerTreeReward(@PathParams('address') address: string): Promise<RewardMerkleClaimModel> {
    return this.rewardsService.getUserRewards(address);
  }

  @Hidden()
  @Get('/shop/:address')
  @ContentType('json')
  async checkBouncerList(@PathParams('address') address: string): Promise<Eligibility> {
    return this.rewardsService.checkBouncerList(address);
  }
}
