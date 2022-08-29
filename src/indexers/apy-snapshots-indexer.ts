import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldSource } from '../aws/models/yield-source.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { getVaultPerformance, queryYieldSources } from '../vaults/vaults.utils';

export async function refreshApySnapshots() {
  for (const chain of getSupportedChains()) {
    const vaults = await chain.vaults.all();
    await Promise.all(vaults.map(async (vault) => refreshChainApySnapshots(chain, vault)));
  }

  return 'done';
}

export async function refreshChainApySnapshots(chain: Chain, vault: VaultDefinitionModel) {
  if (vault.address !== TOKENS.GRAVI_AURA) {
    return;
  }
  try {
    const reportedYieldSources = await getVaultPerformance(chain, vault);
    const currentYieldSources = reportedYieldSources.filter((s) => !isNaN(s.apr) && isFinite(s.apr));
    const currentApr = currentYieldSources.reduce((total, s) => (total += s.apr), 0);
    const previousYieldSources = await queryYieldSources(vault);
    const previousApr = previousYieldSources.reduce((total, s) => (total += s.apr), 0);

    if (currentYieldSources.length === 0 || currentApr === 0) {
      return;
    }

    if (Math.abs(currentApr - previousApr) > previousApr * 0.3) {
      // TODO: add discord webhook message alert here
    }

    const mapper = getDataMapper();
    // check for any emission removal
    const previousSourcesMap: Record<string, YieldSource> = {};
    previousYieldSources.forEach((source) => (previousSourcesMap[source.id] = source));

    // remove updated sources from old source list
    currentYieldSources.forEach((source) => delete previousSourcesMap[source.id]);

    const prunedPreviousYieldSources = Object.values(previousSourcesMap);
    try {
      if (prunedPreviousYieldSources.length > 0) {
        for await (const _item of mapper.batchDelete(prunedPreviousYieldSources)) {
        }
      }

      if (currentYieldSources.length > 0) {
        for await (const _item of mapper.batchPut(currentYieldSources)) {
        }
      }
    } catch (err) {
      console.log({ err, currentYieldSources, prunedPreviousYieldSources, vault });
    }
  } catch (err) {
    console.error({ err, message: `${chain.network} failed to update APY snapshots for vaults` });
  }
}
