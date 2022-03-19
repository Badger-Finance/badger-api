import { Network } from '@badger-dao/sdk';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { UserClaimSnapshot } from './entities/user-claim-snapshot';
import { DebankUser } from './interfaces/debank-user.interface';
import { ListRewardsResponse } from './interfaces/list-rewards-response.interface';
import { RewardsService } from './rewards.service';

@Controller('/rewards')
export class RewardsController {
  @Inject()
  readonly rewardsService!: RewardsService;

  @Get()
  @ContentType('json')
  async list(
    @QueryParams('chain_id') chainId: Network,
    @QueryParams('page_num') pageNum?: number,
    @QueryParams('page_count') pageCount?: number,
  ): Promise<ListRewardsResponse> {
    const chain = Chain.getChain(chainId);
    const records = await this.rewardsService.list({ chain, pageNum, pageCount });
    return {
      total_count: 0,
      total_page_num: 0,
      users: records.map(this.userClaimedSnapshotToDebankUser),
    };
  }

  private userClaimedSnapshotToDebankUser(snapshot: UserClaimSnapshot): DebankUser {
    return {
      user_addr: snapshot.address,
      tokens: snapshot.claimableBalances.map((record) => record.address),
      cumulativeAmounts: snapshot.claimableBalances.map((record) => record.balance),
    };
  }
}
