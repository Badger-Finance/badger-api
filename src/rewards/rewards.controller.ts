import { Controller, Get, Inject, PathParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { AirdropMerkleClaim, RewardMerkleClaim } from '../interface/MerkleDistribution';
import { Eligibility } from './interfaces/eligibility.interface';
import { RewardsService } from './rewards.service';

@Controller('/reward')
export class RewardController {
  @Inject()
  rewardsService!: RewardsService;

  @ContentType('json')
  @Get('/gitcoin/:address')
  async getGitcoinAirdropClaim(@PathParams('address') address: string): Promise<AirdropMerkleClaim> {
    return this.rewardsService.getUserAirdrop('gitcoin-airdrop.json', address);
  }

  @ContentType('json')
  @Get('/bouncer/:address')
  async getBouncerProof(@PathParams('address') address: string): Promise<AirdropMerkleClaim> {
    return this.rewardsService.getBouncerProof('badger-bouncer-proofs.json', address);
  }

  @ContentType('json')
  @Get('/tree/:address')
  async getBadgerTreeReward(@PathParams('address') address: string): Promise<RewardMerkleClaim> {
    return this.rewardsService.getUserRewards(address);
  }

  @ContentType('json')
  @Get('/shop/:address')
  async checkBouncerList(@PathParams('address') address: string): Promise<Eligibility> {
    return this.rewardsService.checkBouncerList(address);
  }
}
