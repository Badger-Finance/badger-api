import { attribute } from '@aws/dynamodb-data-mapper-annotations';
import { TokenBalance } from '@badger-dao/sdk';

export class CachedTokenBalance implements TokenBalance {
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
}
