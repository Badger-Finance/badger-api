import { YieldSource } from '@badger-dao/sdk';

export interface YieldSources {
  apr: number;
  sources: YieldSource[];
  apy: number;
  sourcesApy: YieldSource[];
  nonHarvestSources: YieldSource[];
  nonHarvestSourcesApy: YieldSource[];
}
