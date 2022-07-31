import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { HARVEST_DATA } from '../../config/constants';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';

@table(HARVEST_DATA)
export class VaultPendingHarvestData {
  @hashKey()
  vault!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  yieldTokens!: Array<CachedTokenBalance>;

  @attribute({ memberType: embed(CachedTokenBalance) })
  harvestTokens!: Array<CachedTokenBalance>;

  @attribute()
  lastHarvestedAt!: number;

  @attribute({ memberType: embed(CachedTokenBalance) })
  previousYieldTokens!: Array<CachedTokenBalance>;

  @attribute({ memberType: embed(CachedTokenBalance) })
  previousHarvestTokens!: Array<CachedTokenBalance>;

  @attribute()
  lastMeasuredAt!: number;

  @attribute()
  duration!: number;

  @attribute()
  lastReportedAt!: number;
}
