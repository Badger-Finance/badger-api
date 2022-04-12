import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { ValueSource } from '@badger-dao/sdk';
import { APY_SNAPSHOTS_DATA } from '../../config/constants';
import { SourceType } from '../../rewards/enums/source-type.enum';

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
  type!: SourceType;

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
