import { attribute } from "@aws/dynamodb-data-mapper-annotations";

export class ClaimableBalance {
  @attribute()
  address!: string;

  @attribute()
  balance!: string;
}
