import { isNil } from '@tsed/core';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ValueSourceMap } from '../protocols/interfaces/value-source-map.interface';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVaultValueSources } from './indexer.utils';

export async function refreshApySnapshots() {
  const chains = loadChains();
  await Promise.all(chains.map((chain) => refreshChainApySnapshots(chain)));
}

export async function refreshChainApySnapshots(chain: Chain) {
  await Promise.all(
    chain.setts.map(async (sett) => {
      const results = await getVaultValueSources(chain, sett);
      const sourceMap: ValueSourceMap = {};
      results
        .filter((rawValueSource) => !isNil(rawValueSource))
        .filter((source) => !isNaN(source.apr) && isFinite(source.apr))
        .forEach((source) => {
          const mapKey = [source.address, source.name, source.type].join('-');
          const mapEntry = sourceMap[mapKey];
          // simulated underlying are harvestable, measured underlying is not
          // directly override any saved simulated strategy performance for measured
          const savedVirtualUnderlying = mapEntry && mapEntry.type === SourceType.Compound && mapEntry.harvestable;
          const isVirtualUnderlying = source.type === SourceType.Compound && source.harvestable;
          const override = !mapEntry || savedVirtualUnderlying;
          if (override) {
            sourceMap[mapKey] = source;
          } else if (!isVirtualUnderlying) {
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
      const valueSources = Object.values(sourceMap);
      if (valueSources.length > 0) {
        for await (const _item of mapper.batchPut(Object.values(valueSources))) {
        }
      }
    }),
  );
}
