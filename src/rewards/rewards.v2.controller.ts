import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Description, Returns, Summary } from '@tsed/schema';

import { Chain } from '../chains/config/chain.config';
import { DEFAULT_PAGE_SIZE } from '../config/constants';
import { ListRewardsResponse } from './interfaces/list-rewards-response.interface';
import { RewardsService } from './rewards.service';
import { userClaimedSnapshotToDebankUser } from './rewards.utils';

@Controller('/rewards')
export class RewardsV2Controller {
  @Inject()
  readonly rewardsService!: RewardsService;

  @Get()
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
}
