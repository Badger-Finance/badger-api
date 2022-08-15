"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
const dynamodb_expressions_1 = require("@aws/dynamodb-expressions");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const historic_vault_snapshot_old_model_1 = require("../aws/models/historic-vault-snapshot-old.model");
const migration_process_model_1 = require("../aws/models/migration-process.model");
const chain_1 = require("../chains/chain");
const constants_1 = require("../config/constants");
const migration_constants_1 = require("./migration.constants");
const migration_enums_1 = require("./migration.enums");
const migration_utils_1 = require("./migration.utils");
async function run() {
  let chartDataMigratedCnt = 0;
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  const migrationData = await (0, migration_utils_1.getMigrationData)(
    migration_constants_1.HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID
  );
  if (migrationData && migrationData.status === migration_enums_1.MigrationStatus.Complete) {
    console.log(
      `Nothing left to process, ${constants_1.SETT_HISTORIC_DATA} table copied to ${constants_1.CHART_DATA}. Exiting`
    );
    return;
  }
  const migrationSequences = migrationData ? migrationData.sequences : [];
  const sequenceByVault = Object.fromEntries(migrationSequences.map((m) => [m.name, m]));
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(
      vaults.map(async (vault) => {
        let migrationSequence = sequenceByVault[vault.address];
        if (migrationSequence && migrationSequence.status === migration_enums_1.MigrationStatus.Complete) {
          console.log(`Nothing left to process, for vault ${vault.address}. Skip`);
          return;
        }
        const lastInsertedTimestamp = migrationSequence
          ? Number(migrationSequence.value)
          : migration_constants_1.HISTORIC_VAULT_FIRST_ITEM_TO_MIGR_TS;
        let lastItem;
        let migratedSnapshots = 0;
        for await (const item of mapper.query(
          historic_vault_snapshot_old_model_1.HistoricVaultSnapshotOldModel,
          { address: vault.address, timestamp: (0, dynamodb_expressions_1.greaterThan)(lastInsertedTimestamp) },
          { scanIndexForward: true, limit: 200 }
        )) {
          const historicSnapshot = Object.assign(new historic_vault_snapshot_model_1.HistoricVaultSnapshotModel(), {
            ...item,
            id: historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.formBlobId(item.address, chain.network),
            timestamp: item.timestamp
          });
          migratedSnapshots += 1;
          const migratedCnt = await (0, migration_utils_1.pushHistoricSnapshots)(
            historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.NAMESPACE,
            historicSnapshot
          );
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
            status: migration_enums_1.MigrationStatus.Process
          };
          migrationSequences.push(migrationSequence);
        } else {
          migrationSequence.value = `${lastTimestamp}`;
          migrationSequence.status =
            migratedSnapshots === 0
              ? migration_enums_1.MigrationStatus.Complete
              : migration_enums_1.MigrationStatus.Process;
          // denote that the vault is no longer migrating - this will trigger subsequent charting updates
          if (migrationSequence.status === migration_enums_1.MigrationStatus.Complete) {
            const vaultDefintion = await chain.vaults.getVault(vault.address);
            vaultDefintion.isMigrating = false;
            await mapper.put(vaultDefintion);
          }
        }
      })
    );
  }
  const isEverySequenceMigrated = migrationSequences.every(
    (seq) => seq.status === migration_enums_1.MigrationStatus.Complete
  );
  const migrationStatus = isEverySequenceMigrated
    ? migration_enums_1.MigrationStatus.Complete
    : migration_enums_1.MigrationStatus.Process;
  const migrationStatusText = migrationStatus === migration_enums_1.MigrationStatus.Complete ? "Complete" : "Process";
  await mapper.put(
    Object.assign(new migration_process_model_1.MigrationProcessData(), {
      id: migration_constants_1.HISTORIC_VAULT_TO_CHART_DATA_MIGRATION_ID,
      sequences: migrationSequences,
      status: migrationStatus
    })
  );
  console.log(`Migration status is ${migrationStatusText}, sequences: ${JSON.stringify(migrationSequences, null, 2)}`);
  console.log(`Historic vault migration successfully finished with total ${chartDataMigratedCnt} rows pushed.`);
  return "done";
}
exports.run = run;
//# sourceMappingURL=historic-vault-migration.js.map
