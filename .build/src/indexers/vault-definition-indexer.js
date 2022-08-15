"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureVaultData = void 0;
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const vault_definition_model_1 = require("../aws/models/vault-definition.model");
const chain_1 = require("../chains/chain");
const indexer_utils_1 = require("./indexer.utils");
async function captureVaultData() {
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const sdk = await chain.getSdk();
    let registryVaults = [];
    try {
      registryVaults = await sdk.vaults.loadVaults();
    } catch (_) {
      console.error(`Registry is not defined for ${chain.network}`);
    }
    if (registryVaults.length === 0) {
      continue;
    }
    // update vaults from chain
    await Promise.all(registryVaults.map(async (vault) => updateVaultDefinition(chain, vault)));
    // update isProduction status, for vaults that were already saved in ddb
    const prdVaultsAddrs = registryVaults
      .map((v) => {
        try {
          return ethers_1.ethers.utils.getAddress(v.address);
        } catch (_) {
          return null;
        }
      })
      .filter((v) => v);
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    const query = mapper.query(
      vault_definition_model_1.VaultDefinitionModel,
      { chain: chain.network },
      { indexName: "IndexVaultCompoundDataChain" }
    );
    try {
      for await (const compoundVault of query) {
        if (!prdVaultsAddrs.includes(compoundVault.address)) {
          // mark this vault as not a prod one, mb just delete it, not sure
          compoundVault.isProduction = 0;
          await mapper.put(compoundVault);
        }
      }
    } catch (e) {
      console.error(`Failed to update isProduction status for vaults and chain: ${chain.network}`);
    }
  }
  return "done";
}
exports.captureVaultData = captureVaultData;
async function updateVaultDefinition(chain, vault) {
  let compoundVault;
  try {
    compoundVault = await (0, indexer_utils_1.constructVaultDefinition)(chain, vault);
    if (compoundVault) {
      const mapper = (0, dynamodb_utils_1.getDataMapper)();
      await mapper.put(compoundVault);
    }
  } catch (err) {
    console.error({ err, vault: vault.name });
  }
}
//# sourceMappingURL=vault-definition-indexer.js.map
