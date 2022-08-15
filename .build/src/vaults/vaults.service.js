"use strict";
var VaultsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultsService = void 0;
const tslib_1 = require("tslib");
const sdk_1 = require("@badger-dao/sdk");
const common_1 = require("@tsed/common");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const harvest_compound_model_1 = require("../aws/models/harvest-compound.model");
const historic_vault_snapshot_model_1 = require("../aws/models/historic-vault-snapshot.model");
const charts_utils_1 = require("../charts/charts.utils");
const prices_utils_1 = require("../prices/prices.utils");
const vaults_utils_1 = require("./vaults.utils");
const yields_utils_1 = require("./yields.utils");
let VaultsService = (VaultsService_1 = class VaultsService {
  async getProtocolSummary(chain, currency) {
    const vaults = await chain.vaults.all();
    const summaries = await Promise.all(
      vaults.map(async (vault) => {
        const { balance, value } = await (0, vaults_utils_1.getCachedVault)(chain, vault);
        const convertedValue = await (0, prices_utils_1.convert)(value, currency);
        return { name: vault.name, balance, value: convertedValue };
      })
    );
    const totalValue = summaries.reduce((total, vault) => (total += vault.value), 0);
    return { totalValue, vaults: summaries, setts: summaries };
  }
  async listVaults(chain, currency) {
    const vaults = await chain.vaults.all();
    return Promise.all(vaults.map((vault) => VaultsService_1.loadVault(chain, vault, currency)));
  }
  async listVaultHarvests(chain) {
    const vaults = await chain.vaults.all();
    const harvestsWithSnapshots = await Promise.all(
      vaults.map(async (vault) => {
        return {
          vault: vault.address,
          harvests: await this.getVaultHarvests(chain, vault.address)
        };
      })
    );
    return harvestsWithSnapshots.reduce((acc, harvestWithSnapshot) => {
      acc[harvestWithSnapshot.vault] = harvestWithSnapshot.harvests;
      return acc;
    }, {});
  }
  async getVaultHarvests(chain, address) {
    const vaultHarvests = [];
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    const vault = await chain.vaults.getVault(address);
    const queryHarvests = mapper.query(
      harvest_compound_model_1.HarvestCompoundData,
      { vault: vault.address },
      { indexName: "IndexHarvestCompoundDataVault" }
    );
    try {
      for await (const harvest of queryHarvests) {
        vaultHarvests.push({
          eventType: harvest.eventType,
          strategyBalance: harvest.strategyBalance,
          estimatedApr: harvest.estimatedApr,
          timestamp: harvest.timestamp,
          block: harvest.block,
          token: harvest.token,
          amount: harvest.amount
        });
      }
    } catch (e) {
      console.error(`Failed to get compound harvest from ddb for vault ${vault.address}; ${e}`);
    }
    return vaultHarvests;
  }
  static async loadVault(chain, vaultDefinition, currency) {
    const [vault, yieldSources, pendingHarvest] = await Promise.all([
      (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition, currency),
      (0, yields_utils_1.getYieldSources)(vaultDefinition),
      (0, vaults_utils_1.queryYieldEstimate)(vaultDefinition)
    ]);
    const { lastHarvestedAt } = pendingHarvest;
    const { apr, sources, apy, sourcesApy } = yieldSources;
    vault.lastHarvest = lastHarvestedAt;
    vault.sources = sources;
    vault.sourcesApy = sourcesApy;
    vault.apr = apr;
    vault.apy = apy;
    vault.minApr = vault.sources.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApr = vault.sources.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);
    vault.minApy = vault.sourcesApy.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApy = vault.sourcesApy.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);
    vault.yieldProjection = (0, yields_utils_1.getVaultYieldProjection)(vault, yieldSources, pendingHarvest);
    const hasBoostedApr = vault.sources.some((source) => source.boostable);
    if (vault.boost.enabled && hasBoostedApr) {
      if (vault.type !== sdk_1.VaultType.Native) {
        vault.type = sdk_1.VaultType.Boosted;
      }
    } else {
      // handle a previously boosted vault that is no longer getting boosted sources
      vault.boost.enabled = false;
      if (vault.type !== sdk_1.VaultType.Native) {
        vault.type = sdk_1.VaultType.Standard;
      }
    }
    return vault;
  }
  /**
   *
   * @param vault
   * @param chain
   * @param timestamps
   * @returns
   */
  async getVaultChartDataByTimestamps(vault, chain, timestamps) {
    // validate vault request is correct and valid
    const requestedVault = await chain.vaults.getVault(vault);
    // sort timestamps in ascending order for searching
    const timestampSort = (a, b) => (a > b ? 1 : -1);
    let sortedTimestamps = timestamps.sort(timestampSort);
    // TODO: we should consider making this a map and allowing ourselves to do validation against requested timestamps
    // construct relevant persistence and search criteria
    const snapshots = new Set();
    const vaultBlobId = (0, dynamodb_utils_1.getVaultEntityId)(chain, requestedVault);
    // iterate over all valid charting granularities to ensure discovery of all timestamps
    for (const timeframe of charts_utils_1.CHART_GRANULARITY_TIMEFRAMES) {
      const dataKey = (0, charts_utils_1.toChartDataKey)(
        historic_vault_snapshot_model_1.HistoricVaultSnapshotModel.NAMESPACE,
        vaultBlobId,
        timeframe
      );
      const vaultChartData = await (0, charts_utils_1.queryVaultCharts)(dataKey);
      if (vaultChartData.length === 0) {
        continue;
      }
      // from smaller to greater, we need this order for search to work correctly
      const preparedVaultsChartData = vaultChartData.reverse();
      const remainingTimestamps = [];
      // iterate over timestamps updating the map as snapshots are found
      for (const timestamp of sortedTimestamps) {
        const snapshotItem = preparedVaultsChartData.find((i) => Number(i.timestamp) >= timestamp);
        if (snapshotItem) {
          if (!snapshotItem.pricePerFullShare && snapshotItem.ratio) {
            snapshotItem.pricePerFullShare = snapshotItem.ratio;
          }
          snapshotItem.timestamp = timestamp;
          snapshots.add(snapshotItem);
        } else {
          // keep track of any timestamps whose snapshots could not be matched at this granularity
          remainingTimestamps.push(timestamp);
        }
      }
      // set sorted timestamps (for query) to only remaining timestamps
      sortedTimestamps = remainingTimestamps.sort(timestampSort);
    }
    // now we reverse, so relevant data will come at the start of the list
    return Array.from(snapshots).reverse();
  }
});
VaultsService = VaultsService_1 = tslib_1.__decorate([(0, common_1.Service)()], VaultsService);
exports.VaultsService = VaultsService;
//# sourceMappingURL=vaults.service.js.map
