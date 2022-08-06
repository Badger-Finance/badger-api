import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { updateSnapshots } from '../charts/charts.utils';
import { vaultToSnapshot } from './indexer.utils';

export async function indexProtocolVaults() {
  const timestamp = Date.now();

  for (const chain of SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();

    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const snapshot = await vaultToSnapshot(chain, vault);

          const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: HistoricVaultSnapshotModel.formBlobId(snapshot.address, chain.network),
            timestamp,
          });

          await updateSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);
        } catch (err) {
          console.error(err);
        }
      }),
    );
  }

  return 'done';
}
