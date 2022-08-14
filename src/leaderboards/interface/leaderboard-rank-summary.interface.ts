import { attribute } from "@aws/dynamodb-data-mapper-annotations";

export class LeaderboardRankSummary {
  @attribute()
  badgerType!: string;

  @attribute()
  amount!: number;
}
