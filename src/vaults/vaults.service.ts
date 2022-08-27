import { Currency, VaultDTO, VaultType } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { CHART_GRANULARITY_TIMEFRAMES, queryVaultCharts, toChartDataKey } from '../charts/charts.utils';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { getCachedVault, queryYieldEstimate, queryYieldProjection } from './vaults.utils';
import { getYieldSources } from './yields.utils';

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

  async listVaults(chain: Chain, currency?: Currency): Promise<VaultDTO[]> {
    const vaults = await chain.vaults.all();
    return Promise.all(vaults.map((vault) => VaultsService.loadVault(chain, vault, currency)));
  }

  async listVaultHarvests(chain: Chain): Promise<VaultHarvestsMap> {
    const vaults = await chain.vaults.all();
    const harvestsWithSnapshots = await Promise.all(
      vaults.map(async (vault) => {
        return {
          vault: vault.address,
          harvests: await this.getVaultHarvests(chain, vault.address),
        };
      }),
    );

    return harvestsWithSnapshots.reduce((acc, harvestWithSnapshot) => {
      acc[harvestWithSnapshot.vault] = harvestWithSnapshot.harvests;
      return acc;
    }, <VaultHarvestsMap>{});
  }

  async getVaultHarvests(chain: Chain, address: string): Promise<VaultHarvestsExtendedResp[]> {
    const vaultHarvests: VaultHarvestsExtendedResp[] = [];

    const mapper = getDataMapper();
    const vault = await chain.vaults.getVault(address);

    console.log({
      vault: vault.name,
    });

    const queryHarvests = mapper.query(HarvestCompoundData, { vault: vault.address });

    try {
      for await (const harvest of queryHarvests) {
        vaultHarvests.push({
          eventType: harvest.eventType,
          strategyBalance: harvest.strategyBalance,
          estimatedApr: harvest.estimatedApr,
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

  static async loadVault(chain: Chain, vaultDefinition: VaultDefinitionModel, currency?: Currency): Promise<VaultDTO> {
    const [vault, yieldSources, yieldEstimate, yieldProjection] = await Promise.all([
      getCachedVault(chain, vaultDefinition, currency),
      getYieldSources(vaultDefinition),
      queryYieldEstimate(vaultDefinition),
      queryYieldProjection(vaultDefinition),
    ]);
    const { apr, sources, apy, sourcesApy } = yieldSources;
    const { lastHarvestedAt } = yieldEstimate;

    vault.lastHarvest = lastHarvestedAt;
    vault.sources = sources;
    vault.sourcesApy = sourcesApy;
    vault.apr = apr;
    vault.apy = apy;
    vault.minApr = vault.sources.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApr = vault.sources.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);
    vault.minApy = vault.sourcesApy.map((s) => s.minApr).reduce((total, apr) => (total += apr), 0);
    vault.maxApy = vault.sourcesApy.map((s) => s.maxApr).reduce((total, apr) => (total += apr), 0);
    vault.yieldProjection = yieldProjection;

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
}
