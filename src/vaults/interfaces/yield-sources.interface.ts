import { VaultYieldSummary, YieldSource } from '@badger-dao/sdk';

export interface YieldSources {
  apr: VaultYieldSummary;
  apy: VaultYieldSummary;
  nonHarvestSources: YieldSource[];
  nonHarvestSourcesApy: YieldSource[];
}
