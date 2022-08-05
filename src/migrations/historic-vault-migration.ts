import { greaterThan } from '@aws/dynamodb-expressions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { HistoricVaultSnapshotOldModel } from '../aws/models/historic-vault-snapshot-old.model';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { CHART_DATA, SETT_HISTORIC_DATA } from '../config/constants';
import { HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS, HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID } from './migration.constants';
import { MigrationStatus } from './migration.enums';
import { getMigrationData, pushHistoricSnapshots } from './migration.utils';

export async function run() {
  let chartDataMigratedCnt = 0;

  const mapper = getDataMapper();

  const migrationData = await getMigrationData(HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID);

  if (migrationData && migrationData.status === MigrationStatus.Complete) {
    console.log(`Nothing left to process, ${SETT_HISTORIC_DATA} table copied to ${CHART_DATA}. Exiting`);
    return;
  }

  const migrationSequences = migrationData ? migrationData.sequences : [];
  const sequenceByVault = Object.fromEntries(migrationSequences.map((m) => [m.name, m]));

  for (const chain of SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();

    await Promise.all(
      vaults.map(async (vault) => {
        let migrationSequence = sequenceByVault[vault.address];

        if (migrationSequence && migrationSequence.status === MigrationStatus.Complete) {
          console.log(`Nothing left to process, for vault ${vault.address}. Skip`);
          return;
        }

        const lastInsertedTimestamp = migrationSequence
          ? Number(migrationSequence.value)
          : HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS;

        let lastItem;
        let migratedSnapshots = 0;
        for await (const item of mapper.query(
          HistoricVaultSnapshotOldModel,
          { address: vault.address, timestamp: greaterThan(lastInsertedTimestamp) },
          { scanIndexForward: true, limit: 200 },
        )) {
          const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
            ...item,
            id: HistoricVaultSnapshotModel.formBlobId(item.address, chain.network),
            timestamp: item.timestamp,
          });
          migratedSnapshots += 1;

          const migratedCnt = await pushHistoricSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);
          lastItem = item;
          chartDataMigratedCnt += migratedCnt;
          console.log(`Updated ${migratedCnt} timeframes for ${chain.network} ${vault.name}`);
        }
        console.log(`Updated ${migratedSnapshots} snapshots for ${chain.network} ${vault.name}`);

        if (!lastItem) {
          console.log(`No items found for ${vault.address}. Looks like we done with it`);
        }

        const lastTimestamp = lastItem ? lastItem.timestamp : Date.now();

        if (!migrationSequence) {
          migrationSequence = {
            name: vault.address,
            value: `${lastTimestamp}`,
            status: MigrationStatus.Process,
          };
          migrationSequences.push(migrationSequence);
        } else {
          migrationSequence.value = `${lastTimestamp}`;
          migrationSequence.status = migratedSnapshots === 0 ? MigrationStatus.Complete : MigrationStatus.Process;

          // denote that the vault is no longer migrating - this will trigger subsequent charting updates
          if (migrationSequence.status === MigrationStatus.Complete) {
            const vaultDefintion = await chain.vaults.getVault(vault.address);
            vaultDefintion.isMigrating = false;
            await mapper.put(vaultDefintion);
          }
        }
      }),
    );
  }

  const isEverySequenceMigrated = migrationSequences.every((seq) => seq.status === MigrationStatus.Complete);
  const migrationStatus = isEverySequenceMigrated ? MigrationStatus.Complete : MigrationStatus.Process;
  const migrationStatusText = migrationStatus === MigrationStatus.Complete ? 'Complete' : 'Process';

  await mapper.put(
    Object.assign(new MigrationProcessData(), {
      id: HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID,
      sequences: migrationSequences,
      status: migrationStatus,
    }),
  );

  console.log(`Migration status is ${migrationStatusText}, sequences: ${JSON.stringify(migrationSequences, null, 2)}`);
  console.log(`Historic vault migration successfully finished with total ${chartDataMigratedCnt} rows pushed.`);
  return 'done';
}
