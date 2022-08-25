import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network } from '@badger-dao/sdk';

import { YIELD_SNAPSHOTS_DATA } from '../../config/constants';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { CachedYieldSource } from './cached-yield-source.interface';

@table(YIELD_SNAPSHOTS_DATA)
export class YieldSource extends CachedYieldSource {
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
  type!: SourceType;
}
