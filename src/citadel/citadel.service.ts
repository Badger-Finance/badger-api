import { CitadelRewardType } from '@badger-dao/sdk';
import { CitadelTreasurySummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-treasury-summary.interface';
import { Service } from '@tsed/di';
import { TOKENS } from '../config/tokens.config';
import { getPrice } from '../prices/prices.utils';
import { queryTreasurySummary } from '../treasury/treasury.utils';
import { queryCitadelData } from './citadel.utils';
import { CITADEL_TREASURY_ADDRESS } from './config/citadel-treasury.config';
import { RewardFilter } from '@badger-dao/sdk/lib/citadel/enums/reward-filter.enum';
import { CitadelRewardEvent } from './interfaces/citadel-reward-event.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { CitadelRewardsSnapshot } from '../aws/models/citadel-rewards-snapshot';
import { CitadelRewardEventData } from './destructors/citadel-reward-event.destructor';
import { RewardEventType } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import { CitadelSummary } from '@badger-dao/sdk/lib/api/interfaces/citadel-summary.interface';

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

  async loadRewardSummary(): Promise<CitadelSummary> {
    const { stakingApr, lockingApr, valuePaid } = await queryCitadelData();
    return {
      stakingApr,
      lockingApr: lockingApr.overall,
      lockingAprSources: {
        [CitadelRewardType.Citadel]: lockingApr[CitadelRewardType.Citadel],
        [CitadelRewardType.Funding]: lockingApr[CitadelRewardType.Funding],
        [CitadelRewardType.Yield]: lockingApr[CitadelRewardType.Yield],
        [CitadelRewardType.Tokens]: lockingApr[CitadelRewardType.Tokens],
      },
      // TODO: this data can be pulled curently from the subgraph or rewards db aggregation
      tokensPaid: {},
      valuePaid,
    };
  }

  async getListRewards(
    token?: string,
    account?: string,
    filter: RewardFilter = RewardFilter.PAID,
  ): Promise<CitadelRewardEvent[]> {
    const rewards: CitadelRewardEvent[] = [];

    const mapper = getDataMapper();

    const queryKeys: {
      payType: RewardEventType;
      token?: string;
      account?: string;
    } = { payType: filter };

    const queryOpts: {
      indexName?: string;
      filter?: ConditionExpression;
    } = { indexName: 'IndexCitadelRewardsDataPayType' };

    if (filter === RewardFilter.ADDED) {
      queryOpts.filter = {
        type: 'GreaterThanOrEqualTo',
        object: Date.now(),
        subject: 'finishTime',
      };
    }

    if (account) {
      queryKeys.account = account;
      queryOpts.indexName = 'IndexCitadelRewardsDataPayTypeAccount';
    }
    if (token) {
      queryKeys.token = token;
      queryOpts.indexName = 'IndexCitadelRewardsDataPayTypeToken';
    }

    const query = mapper.query(CitadelRewardsSnapshot, queryKeys, queryOpts);

    try {
      for await (const reward of query) {
        rewards.push(new CitadelRewardEventData(reward));
      }
    } catch (e) {
      console.error(`Failed to get citadel reward from ddb`);
    }

    return rewards;
  }
}
