import { Erc20__factory, formatBalance } from '@badger-dao/sdk';
import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { Service } from '@tsed/di';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { queryTreasurySummary } from '../treasury/treasury.utils';
import { queryCitadelData } from './citadel.utils';
import { CITADEL_TREASURY_ADDRESS } from './config/citadel-treasury.config';
import { Chain } from '../chains/config/chain.config';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { BadRequest } from '@tsed/exceptions';
import { ListRewardsEvent } from '@badger-dao/sdk/lib/citadel/interfaces/list-rewards-event.interface';
import { CitadelRewardEvent } from './interfaces/citadel-reward-event.interface';

@Service()
export class CitadelService {
  async loadTreasurySummary(): Promise<CitadelTreasurySummary> {
    const [baseTreasurySummary, citadelData] = await Promise.all([
      queryTreasurySummary(CITADEL_TREASURY_ADDRESS),
      queryCitadelData(),
    ]);

    const { price } = await getPrice(TOKENS.WBTC);
    const {
      marketCapToTreasuryRatio,
      valuePaid,
      fundingBps,
      lockingBps,
      stakingBps,
      marketCap,
      supply,
      staked,
      stakedPercent,
    } = citadelData;

    const valueBtc = baseTreasurySummary.value / price;
    const valuePaidBtc = valuePaid / price;

    return {
      ...baseTreasurySummary,
      valueBtc,
      valuePaid,
      valuePaidBtc,
      marketCapToTreasuryRatio,
      fundingBps,
      stakingBps,
      lockingBps,
      marketCap,
      supply,
      staked,
      stakedPercent,
    };
  }

  async getListRewards(token: string, user?: string, filter?: RewardFilter): Promise<CitadelRewardEvent[]> {
    const chain = Chain.getChain();
    const sdk = await chain.getSdk();

    let chainRewards: ListRewardsEvent[] = [];

    try {
      chainRewards = await sdk.citadel.listRewards({ user, token, filter });
    } catch (err) {
      throw new BadRequest(`${err}`);
    }

    return Promise.all(
      chainRewards.map(async (event) => {
        const rewardEventResp: CitadelRewardEvent = {
          token: event.token,
          block: event.block,
          amount: 0,
          type: filter ?? RewardFilter.ADDED,
        };

        const tokenContract = Erc20__factory.connect(event.token, sdk.provider);
        const tokenDecimals = await tokenContract.decimals();

        rewardEventResp.amount = formatBalance(event.reward, tokenDecimals);

        if (event.user) rewardEventResp.user = event.user;

        return rewardEventResp;
      }),
    );
  }
}
