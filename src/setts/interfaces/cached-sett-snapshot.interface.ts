import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_SNAPSHOTS_DATA } from '../../config/constants';

@table(SETT_SNAPSHOTS_DATA)
export class CachedSettSnapshot {
  @hashKey()
  address!: string;

  @attribute()
  balance!: number;

  @attribute()
  ratio!: number;

  @attribute()
  settValue!: number;

  @attribute()
  supply!: number;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
