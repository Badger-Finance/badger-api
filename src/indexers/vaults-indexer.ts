import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { HistoricVaultSnapshot } from '../vaults/types/historic-vault-snapshot';
import { vaultToSnapshot } from './indexer.utils';

/**
 * Save snapshots of the vault current state + capture some externally
 * computed data. All values will be availalbe via the API.
 */
export async function indexProtocolVaults() {
  const chains = loadChains();
  await Promise.all(
    chains.map(async (chain) => {
      // create a db connection object per chain
      const mapper = getDataMapper();
      await Promise.all(
        chain.vaults.map(async (vault) => {
          try {
            const snapshot = await vaultToSnapshot(chain, vault);
            await mapper.put(Object.assign(new HistoricVaultSnapshot(), snapshot));
          } catch (err) {
            console.error(err);
          }
        }),
      );
    }),
  );
}
