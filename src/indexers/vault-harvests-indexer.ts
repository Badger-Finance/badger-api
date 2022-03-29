import { BadgerGraph, VaultVersion } from '@badger-dao/sdk';
import { OrderDirection, SettHarvest_OrderBy } from '@badger-dao/sdk/lib/graphql/generated/badger';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { VaultPendingHarvestData } from '../vaults/types/vault-pending-harvest-data';

export async function refreshVaultHarvests() {
  const chains = loadChains();
  await Promise.all(
    chains.map(async (chain) => {
      const graph = new BadgerGraph({ network: chain.network });
      const sdk = await chain.getSdk();
      const mapper = getDataMapper();
      for (const vault of chain.vaults) {
        let harvestData: VaultPendingHarvestData;
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

          harvestData = {
            vault: vault.vaultToken,
            yieldTokens,
            harvestTokens,
            lastHarvestedAt: pendingYield.lastHarvestedAt,
          };
          await mapper.put(Object.assign(new VaultPendingHarvestData(), harvestData));
        } catch (err) {
          if (vault.version && vault.version === VaultVersion.v1_5) {
            console.error(`Failed Index Harvests: ${vault.name} (${chain.network})`);
          } else {
            const { settHarvests } = await graph.loadSettHarvests({
              first: 1,
              where: {
                sett: vault.vaultToken.toLowerCase(),
              },
              orderBy: SettHarvest_OrderBy.Timestamp,
              orderDirection: OrderDirection.Desc,
            });
            if (settHarvests) {
              harvestData = {
                vault: vault.vaultToken,
                yieldTokens: [],
                harvestTokens: [],
                lastHarvestedAt: settHarvests[0].timestamp,
              };
            }
          }
        }
      }
    }),
  );
}
