import { isNil } from '@tsed/core';

import { getDataMapper } from '../aws/dynamodb.utils';
import { CachedValueSource } from '../aws/models/apy-snapshots.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ValueSourceMap } from '../protocols/interfaces/value-source-map.interface';
import { getVaultValueSources } from '../rewards/rewards.utils';
import { getVaultCachedValueSources } from '../vaults/vaults.utils';

export async function refreshApySnapshots() {
  await Promise.all(SUPPORTED_CHAINS.map((chain) => refreshChainApySnapshots(chain)));

  return 'done';
}

export async function refreshChainApySnapshots(chain: Chain) {
  try {
    await Promise.all(
      chain.vaults.map(async (vault) => {
        const results = await getVaultValueSources(chain, vault);
        const sourceMap: ValueSourceMap = {};
        results
          .filter((rawValueSource) => !isNil(rawValueSource))
          .filter((source) => !isNaN(source.apr) && isFinite(source.apr))
          .forEach((source) => {
            const mapKey = [source.address, source.name, source.type].join('-');
            const mapEntry = sourceMap[mapKey];
            if (!mapEntry) {
              sourceMap[mapKey] = source;
            } else {
              mapEntry.apr += source.apr;
              mapEntry.minApr += source.minApr;
              mapEntry.maxApr += source.maxApr;
            }
          });

        const totalApr = results.reduce((total, s) => (total += s.apr), 0);

        // TODO: throw a discord webhook there is some issue ongoing
        if (results.length === 0 || totalApr === 0) {
          // returning here prevents the bad zero data from being persisted
          return;
        }

        const mapper = getDataMapper();
        const valueSources = Object.values(sourceMap);

        // check for any emission removal
        const oldSourcesMap: Record<string, CachedValueSource> = {};
        const oldEmission = await getVaultCachedValueSources(vault);
        oldEmission.forEach((source) => (oldSourcesMap[source.addressValueSourceType] = source));

        // remove updated sources from old source list
        valueSources.forEach((source) => delete oldSourcesMap[source.addressValueSourceType]);

        const oldSources = Object.values(oldSourcesMap);
        try {
          if (oldSources.length > 0) {
            for await (const _item of mapper.batchDelete(oldSources)) {
            }
          }

          if (valueSources.length > 0) {
            for await (const _item of mapper.batchPut(valueSources)) {
            }
          }
        } catch (err) {
          console.log({ err, oldSources, valueSources, vault });
        }
      }),
    );
  } catch (err) {
    console.error({ err, message: `${chain.name} failed to update APY snapshots for vaults` });
  }
}
