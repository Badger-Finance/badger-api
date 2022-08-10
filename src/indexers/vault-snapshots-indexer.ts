import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { updateSnapshots } from '../charts/charts.utils';
import { vaultToSnapshot } from './indexer.utils';

export async function refreshVaultSnapshots() {
  const timestamp = Date.now();
  const mapper = getDataMapper();

  for (const chain of SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const snapshot = await vaultToSnapshot(chain, vault);

          // save a current snapshot of the vault
          await mapper.put(Object.assign(new CurrentVaultSnapshotModel(), snapshot));

          // create a historic vault entry from the same data
          const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: getVaultEntityId(chain, vault),
            timestamp,
          });

          // update whatever time period snapshot lists require the new data
          await updateSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);
        } catch (err) {
          console.error({ err, vault: vault.name });
        }
      }),
    );
  }

  return 'done';
}
