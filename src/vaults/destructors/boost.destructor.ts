import { attribute } from "@aws/dynamodb-data-mapper-annotations";

export class BoostDestructor {
  @attribute()
  enabled!: string;

  @attribute()
  weight!: number;
}
