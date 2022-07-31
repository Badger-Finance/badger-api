import { ONE_DAY_MS, VaultState, VaultVersion } from '@badger-dao/sdk';
import {
  BadgerTreeDistribution_OrderBy,
  OrderDirection,
  SettHarvest_OrderBy,
} from '@badger-dao/sdk/lib/graphql/generated/badger';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { sendPlainTextToDiscord } from '../utils/discord.utils';
import { getVaultPendingHarvest, VAULT_SOURCE } from '../vaults/vaults.utils';

export async function refreshVaultHarvests() {
  await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      const sdk = await chain.getSdk();
      const mapper = getDataMapper();
      for (const vault of chain.vaults) {
        if (vault.state && vault.state === VaultState.Discontinued) {
          continue;
        }

        const existingHarvest = await getVaultPendingHarvest(vault);
        const harvestData: VaultPendingHarvestData = {
          vault: vault.vaultToken,
          yieldTokens: [],
          harvestTokens: [],
          lastHarvestedAt: 0,
          previousYieldTokens: existingHarvest.yieldTokens,
          previousHarvestTokens: existingHarvest.harvestTokens,
          lastMeasuredAt: existingHarvest.lastMeasuredAt,
          duration: 0,
          lastReportedAt: existingHarvest.lastReportedAt,
        };

        let shouldCheckGraph = false;
        const now = Date.now();

        if (vault.version && vault.version === VaultVersion.v1_5) {
          try {
            const pendingHarvest = await sdk.vaults.getPendingHarvest(vault.vaultToken);

            harvestData.harvestTokens = await Promise.all(
              pendingHarvest.tokenRewards.map(async (t) => toBalance(await getFullToken(chain, t.address), t.balance)),
            );

            harvestData.lastHarvestedAt = pendingHarvest.lastHarvestedAt;
          } catch {
            shouldCheckGraph = true;
            // only report an error with the vault every eight hours
            if (now - ONE_DAY_MS / 3 > harvestData.lastReportedAt) {
              sendPlainTextToDiscord(
                `${chain.name} ${vault.name} (${vault.protocol}, ${vault.version}, ${
                  vault.state ?? VaultState.Open
                }) failed to harvest!`,
              );
              harvestData.lastReportedAt = now;
            }
          }

          const pendingYield = await sdk.vaults.getPendingYield(vault.vaultToken);
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
              sett: vault.vaultToken.toLowerCase(),
            },
            orderBy: SettHarvest_OrderBy.Timestamp,
            orderDirection: OrderDirection.Desc,
          });
          const { badgerTreeDistributions } = await sdk.graph.loadBadgerTreeDistributions({
            first: 1,
            where: {
              sett: vault.vaultToken.toLowerCase(),
            },
            orderBy: BadgerTreeDistribution_OrderBy.Timestamp,
            orderDirection: OrderDirection.Desc,
          });

          if (settHarvests.length > 0) {
            harvestData.lastHarvestedAt = settHarvests[0].timestamp;
          }
          if (
            badgerTreeDistributions.length > 0 &&
            badgerTreeDistributions[0].timestamp > harvestData.lastHarvestedAt
          ) {
            harvestData.lastHarvestedAt = badgerTreeDistributions[0].timestamp;
          }
        }

        harvestData.harvestTokens.forEach((t) => {
          if (t.address === vault.depositToken) {
            t.name = VAULT_SOURCE;
          }
        });
        harvestData.duration = now - harvestData.lastMeasuredAt;
        harvestData.lastMeasuredAt = now;
        harvestData.lastHarvestedAt *= 1000;

        try {
          await mapper.put(Object.assign(new VaultPendingHarvestData(), harvestData));
        } catch (err) {
          console.error({ err, vault });
        }
      }
    }),
  );

  return 'done';
}
