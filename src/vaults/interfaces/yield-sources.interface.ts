import { VaultYieldSummary } from '@badger-dao/sdk';

import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';

export interface YieldSources {
  apr: VaultYieldSummary;
  apy: VaultYieldSummary;
  nonHarvestSources: CachedYieldSource[];
  nonHarvestSourcesApy: CachedYieldSource[];
}
