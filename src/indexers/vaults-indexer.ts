import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { vaultToSnapshot } from './indexer.utils';

/**
 * Save snapshots of the vault current state + capture some externally
 * computed data. All values will be availalbe via the API.
 */
export async function indexProtocolVaults() {
  await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      // create a db connection object per chain
      const mapper = getDataMapper();
      await Promise.all(
        chain.vaults.map(async (vault) => {
          try {
            const snapshot = await vaultToSnapshot(chain, vault);
            await mapper.put(Object.assign(new HistoricVaultSnapshotModel(), snapshot));
          } catch (err) {
            console.error(err);
          }
        }),
      );
    }),
  );

  return 'done';
}
