import { greaterThanOrEqualTo } from '@aws/dynamodb-expressions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { HistoricVaultSnapshotOldModel } from '../aws/models/historic-vault-snapshot-old.model';
import { MigrationProcessData } from '../aws/models/migration-process.model';
import { CHART_DATA, SETT_HISTORIC_DATA } from '../config/constants';
import { getChainByVaultAddr } from '../vaults/vaults.utils';
import {
  HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS,
  HISTORIC_VAULT_SEQUENCE_NAME,
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

  const lastInsertedTimestamp = migrationData
    ? Number(migrationData.sequence.value)
    : HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS;

  let lastItem;

  for await (const item of mapper.query(
    HistoricVaultSnapshotOldModel,
    { rangeKey: greaterThanOrEqualTo(lastInsertedTimestamp) },
    { limit: 1000 },
  )) {
    const chain = getChainByVaultAddr(item.address);

    if (!chain) {
      console.log(`Unable to determine chain by vault addr: ${item.address}`);
      continue;
    }

    const historicSnapshot = Object.assign(new HistoricVaultSnapshotModel(), {
      ...item,
      id: HistoricVaultSnapshotModel.formBlobId(item.address, chain.network),
      timestamp: item.timestamp,
      migrated: true,
    });

    const migratedCnt = await pushHistoricSnapshots(HistoricVaultSnapshotModel.NAMESPACE, historicSnapshot);

    lastItem = item;

    chartDataMigratedCnt += migratedCnt;
  }

  if (!lastItem) {
    console.error('Cant find `HistoricVaultSnapshotOldModel`. Exiting');
    return;
  }

  await mapper.put(
    Object.assign(new MigrationProcessData(), {
      id: HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID,
      sequence: {
        name: HISTORIC_VAULT_SEQUENCE_NAME,
        value: `${lastItem.timestamp}`,
      },
      status:
        lastItem.timestamp >= HITORIC_VAULT_LAST_ITEM_TO_MIGR_TS ? MigrationStatus.Complite : MigrationStatus.Process,
    }),
  );

  console.log(`Historic vault migration successfully finished with total ${chartDataMigratedCnt} rows pushed.`);
}
