import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { TokenRate } from '@badger-dao/sdk';

export class CachedTokenRate implements TokenRate {
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
  value!: number;

  @attribute()
  apr!: number;
}
