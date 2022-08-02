import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { HistoricVaultSnapshotOldModel } from '../aws/models/historic-vault-snapshot-old.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { updateSnapshots } from '../charts/charts.utils';
import { vaultToSnapshot } from './indexer.utils';

export async function indexProtocolVaults() {
  const timestamp = Date.now();
  await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      // create a db connection object per chain
      const mapper = getDataMapper();
      const vaults = await chain.vaults.all();

      await Promise.all(
        vaults.map(async (vault) => {
          try {
            const snapshot = await vaultToSnapshot(chain, vault);
            await mapper.put(Object.assign(new HistoricVaultSnapshotOldModel(), snapshot));
            if (!vault.isMigrating) {
              // update chartDataBlob with historic data for vault
              const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
                ...snapshot,
                id: HistoricVaultSnapshotModel.formBlobId(snapshot.address, chain.network),
                timestamp,
              });
              await updateSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);
            }
          } catch (err) {
            console.error(err);
          }
        }),
      );
    }),
  );

  return 'done';
}
