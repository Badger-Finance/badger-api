"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshVaultSnapshots = void 0;
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const current_vault_snapshot_model_1 = require("../aws/models/current-vault-snapshot.model");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const chain_1 = require("../chains/chain");
const charts_utils_1 = require("../charts/charts.utils");
const indexer_utils_1 = require("./indexer.utils");
async function refreshVaultSnapshots() {
  const timestamp = Date.now();
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const snapshot = await (0, indexer_utils_1.vaultToSnapshot)(chain, vault);
          // save a current snapshot of the vault
          await mapper.put(Object.assign(new current_vault_snapshot_model_1.CurrentVaultSnapshotModel(), snapshot));
          // create a historic vault entry from the same data
          const historicSnapshot = Object.assign(new historic_vault_snapshot_model_1.HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: (0, dynamodb_utils_1.getVaultEntityId)(chain, vault),
            timestamp
          });
          // update whatever time period snapshot lists require the new data
          await (0, charts_utils_1.updateSnapshots)(
            historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.NAMESPACE,
            historicSnapshot
          );
        } catch (err) {
          console.error({ err, vault: vault.name });
        }
      })
    );
  }
  return "done";
}
exports.refreshVaultSnapshots = refreshVaultSnapshots;
//# sourceMappingURL=vault-snapshots-indexer.js.map
