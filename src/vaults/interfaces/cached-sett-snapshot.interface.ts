import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { SETT_SNAPSHOTS_DATA } from '../../config/constants';
import { VaultStrategy } from './vault-strategy.interface';

@table(SETT_SNAPSHOTS_DATA)
export class CachedSettSnapshot {
  @hashKey()
  address!: string;

  @attribute()
  balance!: number;

  // TODO: update this value to ppfs - this is a remnant from old implementations
  @attribute()
  ratio!: number;

  @attribute()
  value!: number;

  @attribute()
  supply!: number;

  @attribute()
  available!: number;

  @attribute()
  boostWeight!: number;

  @attribute({ memberType: embed(VaultStrategy) })
  strategy!: VaultStrategy;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;
}
