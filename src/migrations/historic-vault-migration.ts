import { greaterThanOrEqualTo } from '@aws/dynamodb-expressions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { HistoricVaultSnapshotOldModel } from '../aws/models/historic-vault-snapshot-old.model';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { CHART_DATA, SETT_HISTORIC_DATA } from '../config/constants';
import {
  HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS,
  HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID,
  HITORIC_VAULT_LAST_ITEM_TO_MIGR_TS,
} from './migration.constants';
import { MigrationStatus } from './migration.enums';
import { getMigrationData, pushHistoricSnapshots } from './migration.utils';

export async function run() {
  let chartDataMigratedCnt = 0;

  const mapper = getDataMapper();

  const migrationData = await getMigrationData(HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID);

  if (migrationData && migrationData.status === MigrationStatus.Complite) {
    console.log(`Nothing left to process, ${SETT_HISTORIC_DATA} table copied to ${CHART_DATA}. Exiting`);
    return;
  }

  const migrationSequences = migrationData ? migrationData.sequences : [];

  for (const chain of SUPPORTED_CHAINS) {
    const vaults = chain.vaults;

    for (const vault of vaults) {
      const migrationSequence = migrationSequences.find((sequence) => sequence.name === vault.vaultToken);

      if (migrationSequence && migrationSequence.status === MigrationStatus.Complite) {
        console.log(`Nothing left to process, for vaults ${vault.vaultToken}. Skip`);
        continue;
      }

      const lastInsertedTimestamp = migrationSequence
        ? Number(migrationSequence.value)
        : HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS;

      let lastItem;

      for await (const item of mapper.query(
        HistoricVaultSnapshotOldModel,
        { address: vault.vaultToken, timestamp: greaterThanOrEqualTo(lastInsertedTimestamp) },
        { scanIndexForward: true, limit: 20 },
      )) {
        const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
          ...item,
          id: HistoricVaultSnapshotModel.formBlobId(item.address, chain.network),
          timestamp: item.timestamp,
        });

        const migratedCnt = await pushHistoricSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);

        lastItem = item;

        chartDataMigratedCnt += migratedCnt;
      }

      if (!lastItem) {
        console.log(`No items found for ${vault.vaultToken}. Looks like we done with it`);
      }

      const lastTimestamp = lastItem ? lastItem.timestamp : Date.now();

      const migrationStatus =
        lastTimestamp >= HITORIC_VAULT_LAST_ITEM_TO_MIGR_TS ? MigrationStatus.Complite : MigrationStatus.Process;

      const updMigrationSequence = {
        name: vault.vaultToken,
        value: `${lastTimestamp}`,
        status: migrationStatus,
      };

      if (!migrationSequence) {
        migrationSequences.push(updMigrationSequence);
      } else {
        migrationSequence.name = updMigrationSequence.name;
        migrationSequence.value = updMigrationSequence.value;
        migrationSequence.status = updMigrationSequence.status;
      }
    }
  }

  const isEverySequenceMigrated = migrationSequences.every((seq) => seq.status === MigrationStatus.Complite);
  const migrationStatus = isEverySequenceMigrated ? MigrationStatus.Complite : MigrationStatus.Process;
  const migrationStatusText = migrationStatus === MigrationStatus.Complite ? 'Complite' : 'Process';

  await mapper.put(
    Object.assign(new MigrationProcessData(), {
      id: HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID,
      sequences: migrationSequences,
      status: migrationStatus,
    }),
  );

  console.log(`Migration status is ${migrationStatusText}, sequences: ${JSON.stringify(migrationSequences, null, 2)}`);
  console.log(`Historic vault migration successfully finished with total ${chartDataMigratedCnt} rows pushed.`);
}
