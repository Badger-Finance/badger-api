import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { APY_SNAPSHOTS_DATA } from '../../config/constants';
import { ValueSource } from './value-source.interface';

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
  oneDay!: number;

  @attribute()
  threeDay!: number;

  @attribute()
  sevenDay!: number;

  @attribute()
  thirtyDay!: number;

  @attribute()
  boostable!: boolean;

  @attribute()
  harvestable!: boolean;

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
      harvestable: this.harvestable,
      performance: {
        oneDay: this.oneDay,
        threeDay: this.threeDay,
        sevenDay: this.sevenDay,
        thirtyDay: this.thirtyDay,
      },
      minApr: this.minApr,
      maxApr: this.maxApr,
    };
  }
}
