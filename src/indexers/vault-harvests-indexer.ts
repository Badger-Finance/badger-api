import { VaultVersion } from '@badger-dao/sdk';
import {
  BadgerTreeDistribution_OrderBy,
  OrderDirection,
  SettHarvest_OrderBy,
} from '@badger-dao/sdk/lib/graphql/generated/badger';
import { getDataMapper } from '../aws/dynamodb.utils';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { SUPPORTED_CHAINS } from '../chains/chain';

export async function refreshVaultHarvests() {
  await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      const sdk = await chain.getSdk();
      const mapper = getDataMapper();
      for (const vault of chain.vaults) {
        const harvestData: VaultPendingHarvestData = {
          vault: vault.vaultToken,
          yieldTokens: [],
          harvestTokens: [],
          lastHarvestedAt: 0,
        };
        try {
          const [pendingYield, pendingHarvest] = await Promise.all([
            sdk.vaults.getPendingYield(vault.vaultToken),
            sdk.vaults.getPendingHarvest(vault.vaultToken),
          ]);

          const [yieldTokens, harvestTokens] = await Promise.all([
            await Promise.all(
              pendingYield.tokenRewards.map(async (t) => toBalance(await getFullToken(chain, t.address), t.balance)),
            ),
            await Promise.all(
              pendingHarvest.tokenRewards.map(async (t) => toBalance(await getFullToken(chain, t.address), t.balance)),
            ),
          ]);

          harvestData.yieldTokens = yieldTokens;
          harvestData.harvestTokens = harvestTokens;
          harvestData.lastHarvestedAt = pendingHarvest.lastHarvestedAt;
        } catch (err) {
          if (vault.version && vault.version === VaultVersion.v1_5) {
            console.error(`Failed Index Harvests: ${vault.name} (${chain.network})`);
          } else {
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
        }

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
