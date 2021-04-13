import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { ValueSource } from '../interfaces/value-source.interface';

export function cachedValueSourceToValueSource(cachedValueSource: CachedValueSource): ValueSource {
  return {
    name: cachedValueSource.name,
    apy: cachedValueSource.apy,
    harvestable: cachedValueSource.harvestable,
    performance: {
      oneDay: cachedValueSource.oneDay,
      threeDay: cachedValueSource.threeDay,
      sevenDay: cachedValueSource.sevenDay,
      thirtyDay: cachedValueSource.thirtyDay,
    },
  };
}
