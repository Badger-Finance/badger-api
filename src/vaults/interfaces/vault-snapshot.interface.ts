import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_DATA } from '../../config/constants';

@table(SETT_DATA)
export class VaultSnapshot {
  @hashKey()
  address!: string;

  @attribute()
  height!: number;

  @rangeKey()
  timestamp!: number;

  @attribute()
  balance!: number;

  @attribute()
  supply!: number;

  @attribute()
  available!: number;

  @attribute()
  pricePerFullShare!: number;

  @attribute()
  ratio?: number;

  @attribute()
  value!: number;
}
