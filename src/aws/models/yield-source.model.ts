import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network, ValueSource } from '@badger-dao/sdk';

import { YIELD_SNAPSHOTS_DATA } from '../../config/constants';

@table(YIELD_SNAPSHOTS_DATA)
export class YieldSource implements ValueSource {
  @hashKey()
  id!: string;

  @attribute({
    indexKeyConfigurations: {
      IndexApySnapshotsOnAddress: 'HASH',
    },
  })
  chainAddress!: string;

  @attribute()
  chain!: Network;

  @attribute()
  address!: string;

  @attribute()
  type!: string;

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
}