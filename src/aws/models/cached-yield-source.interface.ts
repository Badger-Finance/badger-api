import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { Network, YieldSource } from '@badger-dao/sdk';

import { YIELD_SNAPSHOTS_DATA } from '../../config/constants';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { YieldSummary } from './yield-summary.model';

@table(YIELD_SNAPSHOTS_DATA)
export class CachedYieldSource implements YieldSource {
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

  @attribute()
  name!: string;

  @attribute()
  boostable!: boolean;

  @attribute()
  performance!: YieldSummary;
}
