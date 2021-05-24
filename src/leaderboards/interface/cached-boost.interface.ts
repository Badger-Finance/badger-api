import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { LEADERBOARD_DATA } from '../../config/constants';

@table(LEADERBOARD_DATA)
export class CachedBoost {
  @hashKey()
  leaderboard!: string;

  @rangeKey()
  rank!: number;

  @attribute()
  boost!: number;

  @attribute()
  stakeRatio!: number;

  @attribute()
  address!: string;
}
