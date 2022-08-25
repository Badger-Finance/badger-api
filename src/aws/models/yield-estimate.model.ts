import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';

import { YIELD_ESTIMATES_DATA } from '../../config/constants';
import { CachedTokenBalance } from './cached-token-balance.interface';

@table(YIELD_ESTIMATES_DATA)
export class YieldEstimate {
  @hashKey()
  vault!: string;

  @attribute({ memberType: embed(CachedTokenBalance) })
  yieldTokens!: Array<CachedTokenBalance>;

  @attribute({ memberType: embed(CachedTokenBalance) })
  harvestTokens!: Array<CachedTokenBalance>;

  @attribute({ memberType: embed(CachedTokenBalance) })
  previousYieldTokens!: Array<CachedTokenBalance>;

  @attribute({ memberType: embed(CachedTokenBalance) })
  previousHarvestTokens!: Array<CachedTokenBalance>;

  @attribute({ defaultProvider: () => Number.MAX_SAFE_INTEGER })
  duration!: number;

  @attribute({ defaultProvider: () => 0 })
  lastMeasuredAt!: number;

  @attribute({ defaultProvider: () => 0 })
  lastHarvestedAt!: number;

  @attribute({ defaultProvider: () => 0 })
  lastReportedAt!: number;
}
