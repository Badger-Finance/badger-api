"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@badger-dao/sdk");
const fs_1 = require("fs");
const path_1 = require("path");
async function updatePrices() {
  const vaults = [];
  for (const network of Object.values(sdk_1.Network)) {
    try {
      const api = new sdk_1.BadgerAPI({ network, baseURL: "https://staging-api.badger.com/" });
      const networkVaults = await api.loadVaults();
      networkVaults.forEach((vault) => {
        vaults.push({
          address: vault.vaultToken,
          block: 0,
          timestamp: Date.now(),
          strategyBalance: vault.balance - vault.available,
          boostWeight: vault.boost.weight,
          totalSupply: 0,
          yieldApr: vault.yieldProjection.yieldApr,
          harvestApr: vault.yieldProjection.harvestApr,
          available: vault.available,
          balance: vault.balance,
          pricePerFullShare: vault.pricePerFullShare,
          strategy: vault.strategy,
          value: vault.value,
          apr: vault.apr
        });
      });
    } catch {}
  }
  (0, fs_1.writeFileSync)((0, path_1.resolve)(__dirname, "../vault-snapshots.json"), JSON.stringify(vaults, null, 2));
}
updatePrices();
//# sourceMappingURL=update-snapshots.js.map
