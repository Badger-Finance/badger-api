import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_SNAPSHOTS_DATA } from '../../config/constants';
import { SettStrategy } from './sett-strategy.interface';

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

  @attribute({ memberType: embed(SettStrategy) })
  strategy!: SettStrategy;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
