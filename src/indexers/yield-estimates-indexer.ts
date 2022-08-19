import { ONE_DAY_MS, VaultState, VaultVersion } from '@badger-dao/sdk';
import {
  BadgerTreeDistribution_OrderBy,
  OrderDirection,
  SettHarvest_OrderBy,
} from '@badger-dao/sdk/lib/graphql/generated/badger';

import { getDataMapper } from '../aws/dynamodb.utils';
import { YieldEstimate } from '../aws/models/yield-estimate.model';
import { getSupportedChains } from '../chains/chains.utils';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { sendPlainTextToDiscord } from '../utils/discord.utils';
import { getCachedVault, queryYieldEstimate, VAULT_SOURCE } from '../vaults/vaults.utils';
import { calculateBalanceDifference } from '../vaults/yields.utils';

export async function refreshYieldEstimates() {
  await Promise.all(
    getSupportedChains().map(async (chain) => {
      const sdk = await chain.getSdk();
      const mapper = getDataMapper();
      const vaults = await chain.vaults.all();
      for (const vault of vaults) {
        if (vault.state && vault.state === VaultState.Discontinued) {
          continue;
        }

        const existingHarvest = await queryYieldEstimate(vault);
        const harvestData: YieldEstimate = {
          vault: vault.address,
          yieldTokens: [],
          harvestTokens: [],
          lastHarvestedAt: 0,
          previousYieldTokens: existingHarvest.yieldTokens,
          previousHarvestTokens: existingHarvest.harvestTokens,
          lastMeasuredAt: existingHarvest.lastMeasuredAt ?? 0,
          duration: existingHarvest.duration ?? Number.MAX_SAFE_INTEGER,
          lastReportedAt: existingHarvest.lastReportedAt ?? 0,
        };

        let shouldCheckGraph = false;
        const now = Date.now();

        if (vault.version && vault.version === VaultVersion.v1_5) {
          try {
            const pendingHarvest = await sdk.vaults.getPendingHarvest(vault.address);

            harvestData.harvestTokens = await Promise.all(
              pendingHarvest.tokenRewards.map(async (t) => toBalance(await getFullToken(chain, t.address), t.balance)),
            );

            harvestData.lastHarvestedAt = pendingHarvest.lastHarvestedAt * 1000;
          } catch {
            shouldCheckGraph = true;
            // only report an error with the vault every eight hours
            if (now - ONE_DAY_MS / 3 > harvestData.lastReportedAt) {
              sendPlainTextToDiscord(
                `${chain.network} ${vault.name} (${vault.protocol}, ${vault.version}, ${
                  vault.state ?? VaultState.Open
                }) failed to harvest!`,
              );
              harvestData.lastReportedAt = now;
            }
          }

          const pendingYield = await sdk.vaults.getPendingYield(vault.address);
          harvestData.yieldTokens = await Promise.all(
            pendingYield.tokenRewards.map(async (t) => toBalance(await getFullToken(chain, t.address), t.balance)),
          );
        } else {
          shouldCheckGraph = true;
        }

        if (shouldCheckGraph) {
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
            harvestData.lastHarvestedAt = settHarvests[0].timestamp * 1000;
          }
          if (
            badgerTreeDistributions.length > 0 &&
            badgerTreeDistributions[0].timestamp > harvestData.lastHarvestedAt
          ) {
            harvestData.lastHarvestedAt = badgerTreeDistributions[0].timestamp * 1000;
          }
        }

        // a harvest happened since we last measured, all previous data is now invalid
        if (harvestData.lastHarvestedAt > harvestData.lastMeasuredAt) {
          harvestData.previousHarvestTokens = [];
          harvestData.previousYieldTokens = [];
        }

        const cachedVault = await getCachedVault(chain, vault);
        const {
          strategy: { performanceFee },
        } = cachedVault;
        // max fee bps is 10_000, this scales values by the remainder after fees
        const feeMultiplier = 1 - performanceFee / 10_000;
        const feeScalingFunction = (t: CachedTokenBalance) => {
          t.balance *= feeMultiplier;
          t.value *= feeMultiplier;
        };
        harvestData.harvestTokens.forEach(feeScalingFunction);
        harvestData.yieldTokens.forEach(feeScalingFunction);

        harvestData.harvestTokens.forEach((t) => {
          if (t.address === vault.depositToken) {
            t.name = VAULT_SOURCE;
          }
        });
        harvestData.duration = now - harvestData.lastMeasuredAt;
        harvestData.lastMeasuredAt = now;

        const harvestDifference = calculateBalanceDifference(
          harvestData.previousHarvestTokens,
          harvestData.harvestTokens,
        );
        const hasNegatives = harvestDifference.some((b) => b.balance < 0);

        // if the difference incur negative values due to slippage or otherwise, force a comparison against the full harvest
        if (hasNegatives) {
          harvestData.previousHarvestTokens = [];
        }

        try {
          await mapper.put(Object.assign(new YieldEstimate(), harvestData));
        } catch (err) {
          console.error({ err, vault });
        }
      }
    }),
  );

  return 'done';
}
