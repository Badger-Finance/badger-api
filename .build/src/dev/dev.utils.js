"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveSeedJSONFile = exports.getVaultsDefinitionSeedData = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const chain_1 = require("../chains/chain");
const indexer_utils_1 = require("../indexers/indexer.utils");
const dev_constants_1 = require("./dev.constants");
async function getVaultsDefinitionSeedData() {
  const seedVaults = [];
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const sdk = await chain.getSdk();
    let registryVaults = [];
    try {
      registryVaults = await sdk.vaults.loadVaults();
    } catch (e) {
      console.error(`Problems with getting vaults for chain ${chain.network}. ${e}`);
    }
    if (registryVaults.length === 0) {
      console.error(`No vaults found for chain: ${chain.network}`);
      continue;
    }
    await Promise.all(
      registryVaults.map(async (vault) => {
        let compoundVault;
        try {
          compoundVault = await (0, indexer_utils_1.constructVaultDefinition)(chain, vault);
          if (compoundVault) seedVaults.push(compoundVault);
        } catch (err) {
          console.error({ err, vault: vault.name });
        }
      })
    );
  }
  return seedVaults;
}
exports.getVaultsDefinitionSeedData = getVaultsDefinitionSeedData;
function saveSeedJSONFile(data, filename) {
  (0, fs_1.writeFileSync)(
    (0, path_1.resolve)(__dirname, "../../../", dev_constants_1.VAULT_SEED_DIR, filename),
    JSON.stringify(data, null, 2)
  );
}
exports.saveSeedJSONFile = saveSeedJSONFile;
/************************************************************************/
/*                       Seed utils section end                       */
/************************************************************************/
//# sourceMappingURL=dev.utils.js.map
