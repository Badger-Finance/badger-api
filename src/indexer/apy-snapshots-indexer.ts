import { isNil } from '@tsed/core';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Protocol } from '../config/enums/protocol.enum';
import { getSettValueSources } from './indexer.utils';

export async function refreshApySnapshots() {
  const chains = loadChains();
  const rawValueSources = await Promise.all(
    chains.flatMap((chain) => chain.setts.filter(sett => sett.protocol === Protocol.Convex).map((sett) => getSettValueSources(chain, sett))),
  );

  const valueSources = rawValueSources
    .filter((rawValueSource) => !isNil(rawValueSource))
    .flatMap((sources) => sources.filter((source) => !isNaN(source.apr) || !isFinite(source.apr)));

  const mapper = getDataMapper();
  for (const source of valueSources) {
    try {
      await mapper.put(source);
    } catch (err) {
      console.log({ message: err.message, source });
    }
  }
}
