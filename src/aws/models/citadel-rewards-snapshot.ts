import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { CITADEL_REWARDS_DATA } from '../../config/constants';
import { RewardEventType } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';

@table(CITADEL_REWARDS_DATA)
export class CitadelRewardsSnapshot {
  // user or account, depends on payType
  @hashKey()
  account!: string;

  @rangeKey({ defaultProvider: () => Date.now() })
  createdAt!: number;

  @attribute()
  block!: number;

  @attribute()
  token!: string;

  @attribute()
  amount!: number;

  @attribute()
  payType!: RewardEventType;

  @attribute()
  dataType?: string;

  @attribute()
  apr?: number;

  @attribute()
  startTime?: number;

  @rangeKey()
  finishTime?: number;
}
