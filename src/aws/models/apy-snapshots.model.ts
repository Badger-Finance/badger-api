import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { APY_SNAPSHOTS_DATA } from '../../config/constants';
import { ValueSource } from '../../protocols/interfaces/value-source.interface';

// Can be removed, used only to collect data, no outside exposure found
@table(APY_SNAPSHOTS_DATA)
export class CachedValueSource {
  @hashKey()
  addressValueSourceType!: string;

  @attribute()
  address!: string;

  @attribute()
  name!: string;

  @attribute()
  apr!: number;

  @attribute()
  boostable!: boolean;

  @attribute()
  minApr!: number;

  @attribute()
  maxApr!: number;

  @attribute()
  type!: string;

  @attribute({ defaultProvider: () => Date.now() })
  updatedAt!: number;

  toValueSource(): ValueSource {
    return {
      name: this.name,
      apr: this.apr,
      boostable: this.boostable,
      minApr: this.minApr,
      maxApr: this.maxApr,
    };
  }
}
