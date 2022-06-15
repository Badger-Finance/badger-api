import { formatBalance } from '@badger-dao/sdk';
import { BigNumber } from '@ethersproject/bignumber';
import { Controller, Get, Inject, QueryParams } from '@tsed/common';
import { ContentType, Deprecated, Description, Returns, Summary } from '@tsed/schema';
import { Chain } from '../chains/config/chain.config';
import { DEFAULT_PAGE_SIZE } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { REMDIGG_SHARE_PER_FRAGMENT } from '../prices/custom/remdigg-price';
import { getFullToken } from '../tokens/tokens.utils';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { DebankUser } from './interfaces/debank-user.interface';
import { ListRewardsResponse } from './interfaces/list-rewards-response.interface';
import { RewardsService } from './rewards.service';

@Deprecated()
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
      users: await Promise.all(records.map((record) => this.userClaimedSnapshotToDebankUser(chain, record))),
    };
  }

  private async userClaimedSnapshotToDebankUser(chain: Chain, snapshot: UserClaimSnapshot): Promise<DebankUser> {
    const rewards: Record<string, number> = {};
    for (const record of snapshot.claimableBalances) {
      const { address, balance } = record;
      const token = await getFullToken(chain, address);
      if (token.address === TOKENS.DIGG) {
        rewards[address] = formatBalance(BigNumber.from(balance).div(REMDIGG_SHARE_PER_FRAGMENT), token.decimals);
      } else {
        rewards[address] = formatBalance(balance, token.decimals);
      }
    }
    return {
      user_addr: snapshot.address,
      rewards,
    };
  }
}
