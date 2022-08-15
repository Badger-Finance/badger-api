"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexVaultsHarvestsCompund = void 0;
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const harvest_compound_model_1 = require("../aws/models/harvest-compound.model");
const chain_1 = require("../chains/chain");
const vaults_utils_1 = require("../vaults/vaults.utils");
/**
 * Save compound data for all vaults harvests, on all chains
 */
async function indexVaultsHarvestsCompund() {
  console.log("IndexVaultsHarvestsCompund job has started!");
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    const vaults = await chain.vaults.all();
    for (const vault of vaults) {
      try {
        const lastCompHarvest = await (0, vaults_utils_1.getLastCompoundHarvest)(vault.address);
        const harvests = await (0, vaults_utils_1.getVaultHarvestsOnChain)(
          chain,
          vault.address,
          lastCompHarvest === null || lastCompHarvest === void 0 ? void 0 : lastCompHarvest.block
        );
        if (!harvests || harvests.length === 0) {
          console.warn(`Empty harvests for vault ${vault.address}`);
          continue;
        }
        await Promise.all(
          harvests.map(async (harvest) => {
            const harvestToSave = {
              ...harvest,
              vault: vault.address
            };
            return mapper.put(Object.assign(new harvest_compound_model_1.HarvestCompoundData(), harvestToSave));
          })
        );
      } catch (err) {
        console.error(err);
      }
    }
  }
  return "done";
}
exports.indexVaultsHarvestsCompund = indexVaultsHarvestsCompund;
//# sourceMappingURL=harvest-compound-indexer.js.map
