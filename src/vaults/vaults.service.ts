import { ChartTimeFrame, Currency, Network, VaultDTO, VaultType } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { Chain } from '../chains/config/chain.config';
import { toChartDataKey } from '../charts/charts.utils';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import { getCachedVault, queryPendingHarvest, queryVaultCharts } from './vaults.utils';
import { getVaultYieldProjection, getYieldSources } from './yields.utils';

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

    const queryHarvests = mapper.query(
      HarvestCompoundData,
      { vault: vault.address },
      { indexName: 'IndexHarvestCompoundDataVault' },
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
          amount: harvest.amount,
        });
      }
    } catch (e) {
      console.error(`Failed to get compound harvest from ddb for vault ${vault.address}; ${e}`);
    }

    return vaultHarvests;
  }

  static async loadVault(chain: Chain, vaultDefinition: VaultDefinitionModel, currency?: Currency): Promise<VaultDTO> {
    const [vault, yieldSources, pendingHarvest] = await Promise.all([
      getCachedVault(chain, vaultDefinition, currency),
      getYieldSources(vaultDefinition),
      queryPendingHarvest(vaultDefinition),
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
    vault.yieldProjection = getVaultYieldProjection(vault, yieldSources, pendingHarvest);

    if (vault.boost.enabled) {
      const hasBoostedApr = vault.sources.some((source) => source.boostable);
      if (hasBoostedApr) {
        if (vault.type !== VaultType.Native) {
          vault.type = VaultType.Boosted;
        }
      }
    }

    return vault;
  }

  async loadVaultChartData(
    vaultAddr: string,
    timeframe: ChartTimeFrame,
    chain: Chain,
  ): Promise<HistoricVaultSnapshotModel[]> {
    const vaultBlobId = HistoricVaultSnapshotModel.formBlobId(vaultAddr, chain.network);
    const dataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, timeframe);

    return queryVaultCharts(dataKey);
  }

  async getVaultChartDataByTimestamps(
    vaultAddr: string,
    network: Network,
    timestamps: number[],
  ): Promise<HistoricVaultSnapshotModel[]> {
    // from smaller to greater, we need this order for search to work correctly
    const sortedTimestamps = timestamps.sort((a, b) => (a > b ? 1 : -1));

    const vaultBlobId = HistoricVaultSnapshotModel.formBlobId(vaultAddr, network);
    const dataKey = toChartDataKey(HistoricVaultSnapshotModel.NAMESPACE, vaultBlobId, ChartTimeFrame.Max);

    const vaultChartData = await queryVaultCharts(dataKey);

    const snapshots: Set<HistoricVaultSnapshotModel> = new Set();

    if (vaultChartData.length === 0) {
      return Array.from(snapshots);
    }

    // from smaller to greater, we need this order for search to work correctly
    const preparedVaultsChartData = vaultChartData.reverse();

    for (const timestamp of sortedTimestamps) {
      const snapshotItem = preparedVaultsChartData.find((i) => Number(i.timestamp) >= timestamp);

      if (snapshotItem) {
        if (!snapshotItem.pricePerFullShare && snapshotItem.ratio) {
          snapshotItem.pricePerFullShare = snapshotItem.ratio;
        }
        snapshotItem.timestamp = timestamp;
        snapshots.add(snapshotItem);
      }
    }

    // now we reverse, so relevant data will come at the start of the list
    return Array.from(snapshots).reverse();
  }
}
