import { attribute, hashKey, rangeKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_DATA2 } from '../../config/constants';

@table(SETT_DATA2)
export class SettSnapshot2 {
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
  ratio!: number;

  @attribute()
  value!: number;
}
