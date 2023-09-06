import { Network } from '@badger-dao/sdk';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { getSupportedChains } from '../chains/chains.utils';
import { updateSnapshots } from '../charts/charts.utils';
import { rfw } from '../utils/retry.utils';
import { vaultToSnapshot } from './indexer.utils';

export async function refreshVaultSnapshots() {
  const timestamp = Date.now();
  const mapper = getDataMapper();

  for (const chain of getSupportedChains([Network.Ethereum])) {
    const vaults = await rfw(chain.vaults.all, chain.vaults)();
    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const snapshot = await rfw(vaultToSnapshot)(chain, vault);
          const baseEntity = {
            ...snapshot,
            id: getVaultEntityId(chain, vault),
          };

          // save a current snapshot of the vault
          await mapper.put(Object.assign(new CurrentVaultSnapshotModel(), baseEntity));

          // create a historic vault entry from the same data
          const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
            ...baseEntity,
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
