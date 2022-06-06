import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { CITADEL_REWARDS_DATA } from '../../config/constants';
import { RewardEventType } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';

@table(CITADEL_REWARDS_DATA)
export class CitadelRewardsSnapshot {
  // user or account, depends on payType
  @hashKey({
    indexKeyConfigurations: {
      IndexCitadelRewardsDataPayTypeAccount: 'RANGE',
    },
  })
  account!: string;

  @rangeKey()
  createdAt!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexCitadelRewardsDataPayTypeBlock: 'RANGE',
    },
  })
  block!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexCitadelRewardsDataPayTypeToken: 'RANGE',
    },
  })
  token!: string;

  @attribute()
  amount!: number;

  @attribute()
  epoch!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexCitadelRewardsDataPayType: 'HASH',
      IndexCitadelRewardsDataPayTypeBlock: 'HASH',
      IndexCitadelRewardsDataPayTypeAccount: 'HASH',
      IndexCitadelRewardsDataPayTypeToken: 'HASH',
    },
  })
  payType!: RewardEventType;

  @attribute()
  dataType!: string;

  @attribute()
  apr?: number;

  @attribute()
  startTime?: number;

  @attribute()
  finishTime?: number;
}
