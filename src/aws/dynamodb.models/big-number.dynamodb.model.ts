import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class BigNumberDynamodbModel {
  @attribute()
  hex!: string;

  @attribute()
  type!: string;
}
