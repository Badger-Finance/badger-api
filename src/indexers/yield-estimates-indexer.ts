import BadgerSDK, { ONE_DAY_MS, TokenBalance, VaultState, VaultVersion } from '@badger-dao/sdk';
import {
  BadgerTreeDistribution_OrderBy,
  OrderDirection,
  SettHarvest_OrderBy,
} from '@badger-dao/sdk/lib/graphql/generated/badger';
import { UnprocessableEntity } from '@tsed/exceptions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { CachedYieldProjection } from '../aws/models/cached-yield-projection.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { toTokenValue } from '../tokens/tokens.utils';
import { VAULT_SOURCE } from '../vaults/vaults.config';
import { VaultsService } from '../vaults/vaults.service';
import { queryYieldEstimate } from '../vaults/vaults.utils';
import { getVaultYieldProjection, getYieldSources } from '../vaults/yields.utils';

async function loadGraphTimestamp(sdk: BadgerSDK, vault: VaultDefinitionModel): Promise<number> {
  let lastHarvestedAt = 0;

  const { settHarvests } = await sdk.graph.loadSettHarvests({
    first: 1,
    where: {
      sett: vault.address.toLowerCase(),
    },
    orderBy: SettHarvest_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  });
  const { badgerTreeDistributions } = await sdk.graph.loadBadgerTreeDistributions({
    first: 1,
    where: {
      sett: vault.address.toLowerCase(),
    },
    orderBy: BadgerTreeDistribution_OrderBy.Timestamp,
    orderDirection: OrderDirection.Desc,
  });

  if (settHarvests.length > 0) {
    lastHarvestedAt = settHarvests[0].timestamp * 1000;
  }
  if (badgerTreeDistributions.length > 0 && badgerTreeDistributions[0].timestamp > lastHarvestedAt) {
    lastHarvestedAt = badgerTreeDistributions[0].timestamp * 1000;
  }

  return lastHarvestedAt;
}

async function captureYieldEstimate(chain: Chain, vault: VaultDefinitionModel, now: number): Promise<YieldEstimate> {
  const convert = async (t: TokenBalance) => toTokenValue(chain, t);
  try {
    const sdk = await chain.getSdk();
    const mapper = getDataMapper();
    const yieldEstimate = await queryYieldEstimate(vault);

    let shouldCheckGraph = true;

    if (vault.version === VaultVersion.v1_5) {
      try {
        const pendingHarvest = await sdk.vaults.getPendingHarvest(vault.address);
        yieldEstimate.harvestTokens = await Promise.all(pendingHarvest.tokenRewards.map(convert));
        yieldEstimate.lastHarvestedAt = pendingHarvest.lastHarvestedAt * 1000;
        shouldCheckGraph = false;
      } catch {
        if (now - ONE_DAY_MS > yieldEstimate.lastReportedAt) {
          // TODO: enable once its not busted
          // sendPlainTextToDiscord(
          //   `${chain.network} ${vault.name} (${vault.protocol}, ${vault.version}, ${
          //     vault.state ?? VaultState.Open
          //   }) failed to harvest!`,
          // );
          yieldEstimate.lastReportedAt = now;
        }
      }

      const pendingYield = await sdk.vaults.getPendingYield(vault.address);
      yieldEstimate.yieldTokens = await Promise.all(pendingYield.tokenRewards.map(convert));
    }

    if (shouldCheckGraph) {
      yieldEstimate.lastHarvestedAt = await loadGraphTimestamp(sdk, vault);
    }

    // a harvest happened since we last measured, all previous data is now invalid
    if (yieldEstimate.lastHarvestedAt > yieldEstimate.lastMeasuredAt) {
      yieldEstimate.previousHarvestTokens = [];
      yieldEstimate.previousYieldTokens = [];
    }

    yieldEstimate.duration = now - yieldEstimate.lastMeasuredAt;
    yieldEstimate.lastMeasuredAt = now;
    yieldEstimate.harvestTokens.forEach((t) => {
      if (t.address === vault.depositToken) {
        t.name = VAULT_SOURCE;
      }
    });

    // purposefully await result to leverage try catch
    const result = await mapper.put(Object.assign(new YieldEstimate(), yieldEstimate));
    return result;
  } catch (err) {
    const message = `Failed to estimate yield for ${vault.name}`;
    throw new UnprocessableEntity(message, err);
  }
}

export async function refreshYieldEstimates() {
  const chains = getSupportedChains();
  const now = Date.now();

  for (const chain of chains) {
    const vaults = await chain.vaults.all();

    for (const vault of vaults) {
      if (vault.state === VaultState.Discontinued) {
        continue;
      }

      try {
        const yieldEstimate = await captureYieldEstimate(chain, vault, now);
        const yieldSources = await getYieldSources(vault);
        const cachedVault = await VaultsService.loadVaultV3(chain, vault);
        const yieldProjection = getVaultYieldProjection(chain, cachedVault, yieldSources, yieldEstimate);
        const entity = Object.assign(new CachedYieldProjection(), yieldProjection);

        const mapper = getDataMapper();
        await mapper.put(entity);
      } catch (err) {
        console.error({ err, vault: vault.name });
      }
    }
  }

  return 'done';
}
