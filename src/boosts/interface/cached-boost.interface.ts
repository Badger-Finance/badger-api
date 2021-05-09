import { attribute, hashKey, rangeKey, table } from "@aws/dynamodb-data-mapper-annotations";
import { LEADERBOARD_DATA } from "../../config/constants";

@table(LEADERBOARD_DATA)
export class CachedBoost {
  @hashKey()
  address!: string;

  @rangeKey()
  rank!: number;

  @attribute()
  boost!: number;
}