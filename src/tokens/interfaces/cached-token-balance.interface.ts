import { attribute } from '@aws/dynamodb-data-mapper-annotations';

export class CachedTokenBalance {
  @attribute()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  symbol!: string;

  @attribute()
  decimals!: number;

  @attribute()
  balance!: number;

  @attribute()
  valueEth!: number;

  @attribute()
  valueUsd!: number;
}
