"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexProtocolVaults = void 0;
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const chain_1 = require("../chains/chain");
const charts_utils_1 = require("../charts/charts.utils");
const indexer_utils_1 = require("./indexer.utils");
async function indexProtocolVaults() {
  const timestamp = Date.now();
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(
      vaults.map(async (vault) => {
        try {
          const snapshot = await (0, indexer_utils_1.vaultToSnapshot)(chain, vault);
          const historicSnapshot = Object.assign(new historic_vault_snapshot_model_1.HistoricVaultSnapshotModel(), {
            ...snapshot,
            id: historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.formBlobId(snapshot.address, chain.network),
            timestamp
          });
          await (0, charts_utils_1.updateSnapshots)(
            historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.NAMESPACE,
            historicSnapshot
          );
        } catch (err) {
          console.error(err);
        }
      })
    );
  }
  return "done";
}
exports.indexProtocolVaults = indexProtocolVaults;
//# sourceMappingURL=vaults-indexer.js.map
