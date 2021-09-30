import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class CachedBoostMultiplier {
  @attribute()
  network!: string;
  
  @attribute()
  address!: string;

  @attribute()
  multiplier!: number;
}
