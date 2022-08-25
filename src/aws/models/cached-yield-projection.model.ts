import { embed } from '@aws/dynamodb-data-mapper';
import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
import { VaultYieldProjection } from '@badger-dao/sdk';

import { YIELD_PROJECTIONS_DATA } from '../../config/constants';
import { CachedTokenRate } from './cached-token-rate.interface';
import { CachedYieldSource } from './cached-yield-source.interface';

@table(YIELD_PROJECTIONS_DATA)
export class CachedYieldProjection implements VaultYieldProjection {
  @hashKey()
  id!: string;

  @attribute()
  harvestValue!: number;

  @attribute()
  harvestApr!: number;

  @attribute({ memberType: embed(CachedTokenRate) })
  harvestTokens!: Array<CachedTokenRate>;

  @attribute()
  harvestPeriodApr!: number;

  @attribute()
  harvestPeriodApy!: number;

  @attribute({ memberType: embed(CachedTokenRate) })
  harvestPeriodSources!: Array<CachedTokenRate>;

  @attribute({ memberType: embed(CachedTokenRate) })
  harvestPeriodSourcesApy!: Array<CachedTokenRate>;

  @attribute()
  yieldValue!: number;

  @attribute()
  yieldApr!: number;

  @attribute({ memberType: embed(CachedTokenRate) })
  yieldTokens!: Array<CachedTokenRate>;

  @attribute()
  yieldPeriodApr!: number;

  @attribute({ memberType: embed(CachedTokenRate) })
  yieldPeriodSources!: Array<CachedTokenRate>;

  @attribute()
  nonHarvestApr!: number;

  @attribute()
  nonHarvestApy!: number;

  @attribute({ memberType: embed(CachedYieldSource) })
  nonHarvestSources!: Array<CachedYieldSource>;

  @attribute({ memberType: embed(CachedYieldSource) })
  nonHarvestSourcesApy!: Array<CachedYieldSource>;
}
