import { ValueSource } from "@badger-dao/sdk";
export interface YieldSources {
  apr: number;
  sources: ValueSource[];
  apy: number;
  sourcesApy: ValueSource[];
  nonHarvestSources: ValueSource[];
  nonHarvestSourcesApy: ValueSource[];
}
