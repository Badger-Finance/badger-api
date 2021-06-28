import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class CachedBalance {
  @attribute()
  address!: string;

  @attribute()
  balance!: string;
}
