import { Currency, VaultDTO, VaultDTOV2, VaultDTOV3, VaultType, VaultYieldProjectionV2 } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { getVaultEntityId } from '../aws/dynamodb.utils';
import { CurrentVaultSnapshotModel } from '../aws/models/current-vault-snapshot.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { CHART_GRANULARITY_TIMEFRAMES, queryVaultCharts, toChartDataKey } from '../charts/charts.utils';
import { TOKENS } from '../config/tokens.config';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { getVaultTokens } from '../tokens/tokens.utils';
import { queryVaultHistoricYieldEvents } from './harvests.utils';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { defaultVault, defaultVaultV3, getCachedVault, queryYieldEstimate, queryYieldProjection } from './vaults.utils';
import { getYieldSources, yieldToValueSource } from './yields.utils';

@Service()
export class VaultsService {
  async getProtocolSummary(chain: Chain, currency?: Currency): Promise<ProtocolSummary> {
    const vaults = await chain.vaults.all();
    const summaries = await Promise.all(
      vaults.map(async (vault) => {
        const { balance, value } = await getCachedVault(chain, vault);
        const convertedValue = await convert(value, currency);
        return { name: vault.name, balance, value: convertedValue };
      }),
    );
    const totalValue = summaries.reduce((total, vault) => (total += vault.value), 0);
    return { totalValue, vaults: summaries, setts: summaries };
  }

  async listVaults(chain: Chain, currency?: Currency): Promise<VaultDTOV2[]> {
    const vaults = await chain.vaults.all();
    return Promise.all(vaults.map((vault) => VaultsService.loadVaultV2(chain, vault, currency)));
  }

  async listVaultsV3(chain: Chain, currency?: Currency): Promise<VaultDTOV3[]> {
    const vaults = await chain.vaults.all();
    return Promise.all(vaults.map((vault) => VaultsService.loadVaultV3(chain, vault, currency)));
  }

  async listVaultHarvests(chain: Chain): Promise<VaultHarvestsMap> {
    const vaults = await chain.vaults.all();
    const harvestsWithSnapshots = await Promise.all(
      vaults.map(async (vault) => {
        return {
          vault: vault.address,
          harvests: await this.getVaultHarvests(chain, vault),
        };
      }),
    );

    return harvestsWithSnapshots.reduce((acc, harvestWithSnapshot) => {
      acc[harvestWithSnapshot.vault] = harvestWithSnapshot.harvests;
      return acc;
    }, <VaultHarvestsMap>{});
  }

  async getVaultHarvests(chain: Chain, vault: VaultDefinitionModel): Promise<VaultHarvestsExtendedResp[]> {
    const vaultHarvests: VaultHarvestsExtendedResp[] = [];
    const queryHarvests = await queryVaultHistoricYieldEvents(chain, vault);

    try {
      for await (const harvest of queryHarvests) {
        vaultHarvests.push({
          eventType: harvest.type,
          strategyBalance: harvest.balance,
          estimatedApr: harvest.apr,
          timestamp: harvest.timestamp,
          block: harvest.block,
          token: harvest.token,
          amount: harvest.amount,
        });
      }
    } catch (e) {
      console.error(`Failed to get compound harvest from ddb for vault ${vault.address}; ${e}`);
    }

    return vaultHarvests;
  }

  static async loadVaultV3(
    chain: Chain,
    vaultDefinition: VaultDefinitionModel,
    currency?: Currency,
  ): Promise<VaultDTOV3> {
    const yieldSources = await getYieldSources(vaultDefinition);
    const { apr, sources, apy, sourcesApy } = yieldSources;

    const baseVault = await defaultVaultV3(chain, vaultDefinition);
    const vault = await VaultsService.loadVault(chain, vaultDefinition, baseVault, currency);

    const yieldProjection = await queryYieldProjection(vaultDefinition);
    vault.yieldProjection = yieldProjection;

    const minApr = sources.map((s) => s.performance.minYield).reduce((total, apr) => (total += apr), 0);
    const maxApr = sources.map((s) => s.performance.maxYield).reduce((total, apr) => (total += apr), 0);

    vault.apr = {
      baseYield: apr,
      minYield: minApr,
      maxYield: maxApr,
      grossYield: apr,
      minGrossYield: apr,
      maxGrossYield: apr,
      sources,
    };

    const minApy = sourcesApy.map((s) => s.performance.minYield).reduce((total, apr) => (total += apr), 0);
    const maxApy = sourcesApy.map((s) => s.performance.maxYield).reduce((total, apr) => (total += apr), 0);

    vault.apy = {
      baseYield: apy,
      minYield: minApy,
      maxYield: maxApy,
      grossYield: apy,
      minGrossYield: apy,
      maxGrossYield: apy,
      sources: sourcesApy,
    };

    const { apr: vaultApr } = vault;

    const hasBoostedApr = vaultApr.sources.some((source) => source.boostable);
    if (vault.boost.enabled && hasBoostedApr) {
      if (vault.type !== VaultType.Native) {
        vault.type = VaultType.Boosted;
      }
    } else {
      // handle a previously boosted vault that is no longer getting boosted sources
      vault.boost.enabled = false;
      if (vault.type !== VaultType.Native) {
        vault.type = VaultType.Standard;
      }
    }

    return vault;
  }

  static async loadVaultV2(
    chain: Chain,
    vaultDefinition: VaultDefinitionModel,
    currency?: Currency,
  ): Promise<VaultDTOV2> {
    const yieldSources = await getYieldSources(vaultDefinition);
    const { apr, sources, apy, sourcesApy } = yieldSources;

    const baseVault = await defaultVault(chain, vaultDefinition);
    const vault = await VaultsService.loadVault(chain, vaultDefinition, baseVault, currency);

    const yieldProjection = await queryYieldProjection(vaultDefinition);
    const convertedYieldProjection: VaultYieldProjectionV2 = JSON.parse(JSON.stringify(yieldProjection));
    convertedYieldProjection.nonHarvestSources = yieldProjection.nonHarvestSources.map(yieldToValueSource);
    convertedYieldProjection.nonHarvestSourcesApy = yieldProjection.nonHarvestSourcesApy.map(yieldToValueSource);
    vault.yieldProjection = convertedYieldProjection;

    vault.sources = sources.map(yieldToValueSource);
    vault.sourcesApy = sourcesApy.map(yieldToValueSource);
    vault.apr = apr;
    vault.apy = apy;
    vault.minApr = vault.sources.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApr = vault.sources.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);
    vault.minApy = vault.sourcesApy.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApy = vault.sourcesApy.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);

    const hasBoostedApr = vault.sources.some((source) => source.boostable);
    if (vault.boost.enabled && hasBoostedApr) {
      if (vault.type !== VaultType.Native) {
        vault.type = VaultType.Boosted;
      }
    } else {
      // handle a previously boosted vault that is no longer getting boosted sources
      vault.boost.enabled = false;
      if (vault.type !== VaultType.Native) {
        vault.type = VaultType.Standard;
      }
    }

    return vault;
  }

  static async loadVault<T extends VaultDTO>(
    chain: Chain,
    definition: VaultDefinitionModel,
    vault: T,
    currency?: Currency,
  ): Promise<T> {
    const [snapshot, yieldEstimate] = await Promise.all([
      getCachedVault(chain, definition),
      queryYieldEstimate(definition),
    ]);
    const { lastHarvestedAt } = yieldEstimate;

    if (snapshot) {
      await VaultsService.setVaultInformation(chain, vault, snapshot, currency);
    }

    vault.lastHarvest = lastHarvestedAt;

    return vault;
  }

  /**
   *
   * @param vault
   * @param chain
   * @param timestamps
   * @returns
   */
  async getVaultChartDataByTimestamps(
    vault: string,
    chain: Chain,
    timestamps: number[],
  ): Promise<HistoricVaultSnapshotModel[]> {
    // validate vault request is correct and valid
    const requestedVault = await chain.vaults.getVault(vault);

    // sort timestamps in ascending order for searching
    const timestampSort = (a: number, b: number) => (a > b ? 1 : -1);
    let sortedTimestamps = timestamps.sort(timestampSort);

    // TODO: we should consider making this a map and allowing ourselves to do validation against requested timestamps
    // construct relevant persistence and search criteria
    const snapshots: Set<HistoricVaultSnapshotModel> = new Set();
    const vaultBlobId = getVaultEntityId(chain, requestedVault);

    // iterate over all valid charting granularities to ensure discovery of all timestamps
    for (const timeframe of CHART_GRANULARITY_TIMEFRAMES) {
      const dataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, timeframe);

      const vaultChartData = await queryVaultCharts(dataKey);

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

  static async setVaultInformation<T extends VaultDTO>(
    chain: Chain,
    vault: T,
    item: CurrentVaultSnapshotModel,
    currency?: Currency,
  ) {
    vault.available = item.available;
    vault.balance = item.balance;
    vault.value = item.value;
    if (item.balance === 0 || item.totalSupply === 0) {
      vault.pricePerFullShare = 1;
    } else if (vault.vaultToken === TOKENS.BDIGG) {
      vault.pricePerFullShare = item.balance / item.totalSupply;
    } else {
      vault.pricePerFullShare = item.pricePerFullShare;
    }
    vault.strategy = item.strategy;
    vault.boost = {
      enabled: item.boostWeight > 0,
      weight: item.boostWeight,
    };
    const [tokens, convertedValue] = await Promise.all([
      getVaultTokens(chain, { address: vault.vaultToken }, currency),
      convert(item.value, currency),
    ]);
    vault.tokens = tokens;
    vault.value = convertedValue;
  }
}
