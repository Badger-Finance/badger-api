import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { PRICE_DATA } from '../../config/constants';

@table(PRICE_DATA)
export class TokenPriceSnapshot {
  @hashKey()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  usd!: number;

  @attribute()
  eth!: number;

  @rangeKey({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
