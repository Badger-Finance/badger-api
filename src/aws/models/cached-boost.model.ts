import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { UserBoostData } from '@badger-dao/sdk';
import { LEADERBOARD_DATA } from '../../config/constants';

@table(LEADERBOARD_DATA)
export class CachedBoost implements UserBoostData {
  @hashKey({
    indexKeyConfigurations: {
      IndexLeaderBoardRankOnAddressAndLeaderboard: 'RANGE',
    },
  })
  leaderboard!: string;

  @rangeKey()
  boostRank!: number;

  @attribute({
    indexKeyConfigurations: {
      IndexLeaderBoardRankOnAddressAndLeaderboard: 'HASH',
    },
  })
  address!: string;

  @attribute()
  boost!: number;

  @attribute()
  stakeRatio!: number;

  @attribute()
  nftBalance!: number;

  @attribute()
  bveCvxBalance!: number;

  @attribute()
  diggBalance!: number;

  @attribute()
  nativeBalance!: number;

  @attribute()
  nonNativeBalance!: number;
}
