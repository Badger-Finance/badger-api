import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class CachedBalance {
  @attribute()
  network!: string;

  @attribute()
  address!: string;

  @attribute()
  balance!: string;
}
