import { isNil } from '@tsed/core';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { ValueSourceMap } from '../protocols/interfaces/value-source-map.interface';
import { getSettValueSources } from './indexer.utils';

export async function refreshApySnapshots() {
  const chains = loadChains();
  const rawValueSources = await Promise.all(
    chains.flatMap((chain) => chain.setts.map((sett) => getSettValueSources(chain, sett))),
  );

  const sourceMap: ValueSourceMap = {};
  rawValueSources
    .filter((rawValueSource) => !isNil(rawValueSource))
    .flatMap((sources) => sources.filter((source) => !isNaN(source.apr) || !isFinite(source.apr)))
    .forEach((source) => {
      const mapKey = `${source.address}-${source.name}`;
      const mapEntry = sourceMap[mapKey];
      if (!mapEntry) {
        sourceMap[mapKey] = source;
      } else {
        mapEntry.apr += source.apr;
        mapEntry.minApr += source.minApr;
        mapEntry.maxApr += source.maxApr;
        mapEntry.oneDay += source.oneDay;
        mapEntry.threeDay += source.threeDay;
        mapEntry.sevenDay += source.sevenDay;
        mapEntry.thirtyDay += source.thirtyDay;
      }
    });

  const mapper = getDataMapper();
  for (const source of Object.values(sourceMap)) {
    try {
      await mapper.put(source);
    } catch (err) {
      console.log({ message: err.message, source });
    }
  }
}
