import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ASSET_DATA } from '../../config/constants';

@table(ASSET_DATA)
export class SettSnapshot {
  @hashKey()
  asset!: string;

  @attribute()
  height!: number;

  @attribute()
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
