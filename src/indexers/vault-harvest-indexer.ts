import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { VaultPendingHarvestData } from '../vaults/types/vault-pending-harvest-data';

export async function refreshVaultHarvests() {
  const chains = loadChains();
  await Promise.all(
    chains.map(async (c) => {
      const sdk = await c.getSdk();
      const mapper = getDataMapper();
      for (const vault of c.vaults) {
        try {
          const [pendingYield, pendingHarvest] = await Promise.all([
            sdk.vaults.getPendingYield(vault.vaultToken),
            sdk.vaults.getPendingHarvest(vault.vaultToken),
          ]);

          const [yieldTokens, harvestTokens] = await Promise.all([
            await Promise.all(
              pendingYield.tokenRewards.map(async (t) => toBalance(await getFullToken(c, t.address), t.balance)),
            ),
            await Promise.all(
              pendingHarvest.tokenRewards.map(async (t) => toBalance(await getFullToken(c, t.address), t.balance)),
            ),
          ]);
          const harvestData: VaultPendingHarvestData = {
            vault: vault.vaultToken,
            yieldTokens,
            harvestTokens,
            lastHarvestedAt: pendingYield.lastHarvestedAt,
          };
          await mapper.put(Object.assign(new VaultPendingHarvestData(), harvestData));
        } catch (err) {
          console.log(err);
        }
      }
    }),
  );
}
