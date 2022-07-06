import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { HistoricVaultSnapshotOldModel } from '../aws/models/historic-vault-snapshot-old.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { updateSnapshots } from '../charts/charts.utils';
import { vaultToSnapshot } from './indexer.utils';

// This indexer is deprecated, and should be removed after regV2 full migration
// except chart data update, this should be moved to vault-compound-indexer
export async function indexProtocolVaults() {
  await Promise.all(
    SUPPORTED_CHAINS.map(async (chain) => {
      // create a db connection object per chain
      const mapper = getDataMapper();
      await Promise.all(
        chain.vaults.map(async (vault) => {
          try {
            const snapshot = await vaultToSnapshot(chain, vault);
            await mapper.put(Object.assign(new HistoricVaultSnapshotOldModel(), snapshot));
            // update chartDataBlob with historic data for vault
            const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
              ...snapshot,
              id: snapshot.address,
              timestamp: Date.now(),
            });

            await updateSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    }),
  );

  return 'done';
}
