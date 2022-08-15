"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshYieldEstimates = void 0;
const sdk_1 = require("@badger-dao/sdk");
const badger_1 = require("@badger-dao/sdk/lib/graphql/generated/badger");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const yield_estimate_model_1 = require("../aws/models/yield-estimate.model");
const chain_1 = require("../chains/chain");
const tokens_utils_1 = require("../tokens/tokens.utils");
const discord_utils_1 = require("../utils/discord.utils");
const vaults_utils_1 = require("../vaults/vaults.utils");
const yields_utils_1 = require("../vaults/yields.utils");
async function refreshYieldEstimates() {
  await Promise.all(
    chain_1.SUPPORTED_CHAINS.map(async (chain) => {
      var _a, _b, _c, _d;
      const sdk = await chain.getSdk();
      const mapper = (0, dynamodb_utils_1.getDataMapper)();
      const vaults = await chain.vaults.all();
      for (const vault of vaults) {
        if (vault.state && vault.state === sdk_1.VaultState.Discontinued) {
          continue;
        }
        const existingHarvest = await (0, vaults_utils_1.queryYieldEstimate)(vault);
        const harvestData = {
          vault: vault.address,
          yieldTokens: [],
          harvestTokens: [],
          lastHarvestedAt: 0,
          previousYieldTokens: existingHarvest.yieldTokens,
          previousHarvestTokens: existingHarvest.harvestTokens,
          lastMeasuredAt: (_a = existingHarvest.lastMeasuredAt) !== null && _a !== void 0 ? _a : 0,
          duration: (_b = existingHarvest.duration) !== null && _b !== void 0 ? _b : Number.MAX_SAFE_INTEGER,
          lastReportedAt: (_c = existingHarvest.lastReportedAt) !== null && _c !== void 0 ? _c : 0
        };
        let shouldCheckGraph = false;
        const now = Date.now();
        if (vault.version && vault.version === sdk_1.VaultVersion.v1_5) {
          try {
            const pendingHarvest = await sdk.vaults.getPendingHarvest(vault.address);
            harvestData.harvestTokens = await Promise.all(
              pendingHarvest.tokenRewards.map(async (t) =>
                (0, tokens_utils_1.toBalance)(await (0, tokens_utils_1.getFullToken)(chain, t.address), t.balance)
              )
            );
            harvestData.lastHarvestedAt = pendingHarvest.lastHarvestedAt * 1000;
          } catch {
            shouldCheckGraph = true;
            // only report an error with the vault every eight hours
            if (now - sdk_1.ONE_DAY_MS / 3 > harvestData.lastReportedAt) {
              (0, discord_utils_1.sendPlainTextToDiscord)(
                `${chain.network} ${vault.name} (${vault.protocol}, ${vault.version}, ${
                  (_d = vault.state) !== null && _d !== void 0 ? _d : sdk_1.VaultState.Open
                }) failed to harvest!`
              );
              harvestData.lastReportedAt = now;
            }
          }
          const pendingYield = await sdk.vaults.getPendingYield(vault.address);
          harvestData.yieldTokens = await Promise.all(
            pendingYield.tokenRewards.map(async (t) =>
              (0, tokens_utils_1.toBalance)(await (0, tokens_utils_1.getFullToken)(chain, t.address), t.balance)
            )
          );
        } else {
          shouldCheckGraph = true;
        }
        if (shouldCheckGraph) {
          const { settHarvests } = await sdk.graph.loadSettHarvests({
            first: 1,
            where: {
              sett: vault.address.toLowerCase()
            },
            orderBy: badger_1.SettHarvest_OrderBy.Timestamp,
            orderDirection: badger_1.OrderDirection.Desc
          });
          const { badgerTreeDistributions } = await sdk.graph.loadBadgerTreeDistributions({
            first: 1,
            where: {
              sett: vault.address.toLowerCase()
            },
            orderBy: badger_1.BadgerTreeDistribution_OrderBy.Timestamp,
            orderDirection: badger_1.OrderDirection.Desc
          });
          if (settHarvests.length > 0) {
            harvestData.lastHarvestedAt = settHarvests[0].timestamp * 1000;
          }
          if (
            badgerTreeDistributions.length > 0 &&
            badgerTreeDistributions[0].timestamp > harvestData.lastHarvestedAt
          ) {
            harvestData.lastHarvestedAt = badgerTreeDistributions[0].timestamp * 1000;
          }
        }
        // a harvest happened since we last measured, all previous data is now invalid
        if (harvestData.lastHarvestedAt > harvestData.lastMeasuredAt) {
          harvestData.previousHarvestTokens = [];
          harvestData.previousYieldTokens = [];
        }
        const cachedVault = await (0, vaults_utils_1.getCachedVault)(chain, vault);
        const {
          strategy: { performanceFee }
        } = cachedVault;
        // max fee bps is 10_000, this scales values by the remainder after fees
        const feeMultiplier = 1 - performanceFee / 10000;
        const feeScalingFunction = (t) => {
          t.balance *= feeMultiplier;
          t.value *= feeMultiplier;
        };
        harvestData.harvestTokens.forEach(feeScalingFunction);
        harvestData.yieldTokens.forEach(feeScalingFunction);
        harvestData.harvestTokens.forEach((t) => {
          if (t.address === vault.depositToken) {
            t.name = vaults_utils_1.VAULT_SOURCE;
          }
        });
        harvestData.duration = now - harvestData.lastMeasuredAt;
        harvestData.lastMeasuredAt = now;
        const harvestDifference = (0, yields_utils_1.calculateBalanceDifference)(
          harvestData.previousHarvestTokens,
          harvestData.harvestTokens
        );
        const hasNegatives = harvestDifference.some((b) => b.balance < 0);
        // if the difference incur negative values due to slippage or otherwise, force a comparison against the full harvest
        if (hasNegatives) {
          harvestData.previousHarvestTokens = [];
        }
        try {
          await mapper.put(Object.assign(new yield_estimate_model_1.YieldEstimate(), harvestData));
        } catch (err) {
          console.error({ err, vault });
        }
      }
    })
  );
  return "done";
}
exports.refreshYieldEstimates = refreshYieldEstimates;
//# sourceMappingURL=yield-estimates-indexer.js.map
