import {
  ChartTimeFrame,
  Currency,
  keyBy,
  Network,
  ONE_YEAR_MS,
  Protocol,
  VaultDTO,
  VaultSnapshot,
  VaultState,
  VaultType,
} from '@badger-dao/sdk';
import { VaultYieldProjection } from '@badger-dao/sdk/lib/api/interfaces/vault-yield-projection.interface';
import { MetadataClient } from '@badger-dao/sdk/lib/registry.v2/enums/metadata.client.enum';
import { Service } from '@tsed/common';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { Chain } from '../chains/config/chain.config';
import { toChartDataKey } from '../charts/charts.utils';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { SourceType } from '../rewards/enums/source-type.enum';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { getCachedTokenBalances } from '../tokens/tokens.utils';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import {
  getCachedVault,
  getVaultPendingHarvest,
  getVaultSnapshotsAtTimestamps,
  getVaultYieldSources,
  isPassiveVaultSource,
  queryVaultCharts,
  VAULT_SOURCE,
} from './vaults.utils';

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
    return Promise.all(vaults.map((vault) => this.getVault(chain, vault, currency)));
  }

  async listV3Vaults(chain: Chain, currency?: Currency, client?: MetadataClient): Promise<VaultDTO[]> {
    let vaults = await chain.vaults.all();

    if (client) {
      vaults = vaults.filter((v) => v.client === client);
    }

    return Promise.all(vaults.map((vault) => this.getVault(chain, vault, currency)));
  }

  async getVault(chain: Chain, vaultDefinition: VaultDefinitionModel, currency?: Currency): Promise<VaultDTO> {
    return VaultsService.loadVault(chain, vaultDefinition, currency);
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
    const [vault, sources, pendingHarvest] = await Promise.all([
      getCachedVault(chain, vaultDefinition),
      getVaultYieldSources(vaultDefinition),
      getVaultPendingHarvest(vaultDefinition),
    ]);
    vault.tokens = await getCachedTokenBalances(chain, vault, currency);
    vault.value = await convert(vault.value, currency);
    const baseSources = sources
      .filter((source) => source.apr >= 0.001)
      .filter((source) => {
        if (source.name !== VAULT_SOURCE) {
          return true;
        }
        return vault.state !== VaultState.Discontinued;
      });
    const sourcesApr = baseSources.filter(
      (source) => source.type !== SourceType.Compound && !source.type.includes('derivative'),
    );
    const sourcesApy = baseSources.filter((source) => source.type !== SourceType.PreCompound);
    vault.sources = sourcesApr.map((s) => s.toValueSource());
    vault.sourcesApy = sourcesApy.map((s) => s.toValueSource());
    vault.apr = vault.sources.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
    vault.apy = vault.sourcesApy.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
    vault.protocol = vaultDefinition.protocol ?? Protocol.Badger;
    vault.lastHarvest = pendingHarvest.lastHarvestedAt;

    const harvestProjection = this.getVaultYieldProjection(vault, pendingHarvest);
    // filter out all vault compound sources - this include 'precompound' as well
    const passiveSources = sourcesApy.filter(isPassiveVaultSource);
    const passiveSourcesApr = passiveSources.reduce((total, s) => (total += s.apr), 0);
    const convertedPassiveSources = passiveSources.map((s) => {
      const { name, apr, address, type } = s;
      const value = (apr * vault.value) / 100;
      return {
        name,
        apr,
        address,
        symbol: type,
        decimals: 0,
        balance: 0,
        value,
      };
    });

    harvestProjection.harvestTokens = harvestProjection.harvestTokens.concat(convertedPassiveSources);
    harvestProjection.yieldTokens = harvestProjection.yieldTokens.concat(convertedPassiveSources);
    harvestProjection.harvestTokensPerPeriod = harvestProjection.harvestTokensPerPeriod.concat(convertedPassiveSources);
    harvestProjection.yieldTokensPerPeriod = harvestProjection.yieldTokensPerPeriod.concat(convertedPassiveSources);
    harvestProjection.yieldApr += passiveSourcesApr;
    harvestProjection.yieldPeriodApr += passiveSourcesApr;
    harvestProjection.harvestApr += passiveSourcesApr;
    harvestProjection.harvestApy += passiveSourcesApr;
    harvestProjection.harvestPeriodApr += passiveSourcesApr;
    harvestProjection.harvestPeriodApy += passiveSourcesApr;

    vault.yieldProjection = harvestProjection;

    if (vault.boost.enabled) {
      const hasBoostedApr = vault.sources.some((source) => source.boostable);
      if (hasBoostedApr) {
        vault.minApr = vault.sources.map((s) => s.minApr || s.apr).reduce((total, apr) => (total += apr), 0);
        vault.maxApr = vault.sources.map((s) => s.maxApr || s.apr).reduce((total, apr) => (total += apr), 0);
        vault.minApy = vault.sourcesApy.map((s) => s.minApr || s.apr).reduce((total, apr) => (total += apr), 0);
        vault.maxApy = vault.sourcesApy.map((s) => s.maxApr || s.apr).reduce((total, apr) => (total += apr), 0);
        if (vault.type !== VaultType.Native) {
          vault.type = VaultType.Boosted;
        }
      } else {
        vault.boost.enabled = false;
      }
    }

    return vault;
  }

  async getVaultSnapshots(chain: Chain, vault: VaultDefinitionModel, timestamps: number[]): Promise<VaultSnapshot[]> {
    return getVaultSnapshotsAtTimestamps(chain, vault, timestamps);
  }

  /**
   * Evalauate the projected vault yield in a multitude of ways.
   * - Evaluates the previous yield measurement period performance
   * - Evaluates the previous harvest measurement performance
   * The yield measuremeant is a most update data differential reward measurement between
   * measurement intervals. This is the closest to spot APR any system can come.
   * The harvest measurement is the truer APR being realized during the overall harvest.
   * This value may be lower than spot due to fluctuating reward values during measurement or
   * harvest periods.
   * @param vault vault requested for projection
   * @param pendingHarvest vault harvest measurements
   * @returns evaluated vault yield projection
   */
  public static getVaultYieldProjection(
    // refactor regV2, Data Objects interfaces should be in api alongside with models
    vault: Pick<VaultDTO, 'value' | 'balance' | 'available' | 'lastHarvest' | 'underlyingToken'>,
    pendingHarvest: VaultPendingHarvestData,
  ): VaultYieldProjection {
    const { value, balance, available, lastHarvest } = vault;
    const { yieldTokens, previousYieldTokens, harvestTokens, previousHarvestTokens, duration } = pendingHarvest;

    // we need to construct a measurement diff from the originally measured tokens and the new tokens
    const previousYieldByToken = keyBy(previousYieldTokens, (t) => t.address);
    const yieldTokensCurrent: CachedTokenBalance[] = JSON.parse(JSON.stringify(yieldTokens));
    yieldTokensCurrent.forEach((t) => {
      const yieldedTokens = previousYieldByToken.get(t.address);
      if (yieldedTokens) {
        // lock in current price and caculate value on updated balance
        for (const token of yieldedTokens) {
          const price = t.value / t.balance;
          t.balance -= token.balance;
          t.value = t.balance * price;
        }
      }
    });

    const previousHarvestByToken = keyBy(previousHarvestTokens, (t) => t.address);
    const harvestTokensCurrent: CachedTokenBalance[] = JSON.parse(JSON.stringify(harvestTokens));
    harvestTokensCurrent.forEach((t) => {
      const harvestedTokens = previousHarvestByToken.get(t.address);
      if (harvestedTokens) {
        // lock in current price and caculate value on updated balance
        for (const token of harvestedTokens) {
          const price = t.value / t.balance;
          t.balance -= token.balance;
          t.value = t.balance * price;
        }
      }
    });

    // calculate the overall harvest values
    const harvestValue = harvestTokens.reduce((total, token) => (total += token.value), 0);
    const yieldValue = yieldTokens.reduce((total, token) => (total += token.value), 0);
    const harvestCompoundValue = harvestTokens
      .filter((t) => vault.underlyingToken === t.address)
      .reduce((total, token) => (total += token.value), 0);
    const harvestDuration = Date.now() - lastHarvest;

    // calculate the current measurement periods values
    const harvestValuePerPeriod = harvestTokensCurrent.reduce((total, token) => (total += token.value), 0);
    const yieldValuePerPeriod = yieldTokensCurrent.reduce((total, token) => (total += token.value), 0);
    const harvestCompoundValuePerPeriod = harvestTokensCurrent
      .filter((t) => vault.underlyingToken === t.address)
      .reduce((total, token) => (total += token.value), 0);

    const earningValue = balance > 0 ? value * ((balance - available) / balance) : 0;
    return {
      harvestApr: this.calculateProjectedYield(earningValue, harvestValue, harvestDuration),
      harvestApy: this.calculateProjectedYield(earningValue, harvestValue, harvestDuration, harvestCompoundValue),
      harvestPeriodApr: this.calculateProjectedYield(earningValue, harvestValuePerPeriod, duration),
      harvestPeriodApy: this.calculateProjectedYield(
        earningValue,
        harvestValuePerPeriod,
        duration,
        harvestCompoundValuePerPeriod,
      ),
      harvestTokens: harvestTokens.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, harvestDuration);
        return {
          apr,
          ...t,
        };
      }),
      harvestTokensPerPeriod: harvestTokensCurrent.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, duration);
        return {
          apr,
          ...t,
        };
      }),
      harvestValue,
      yieldApr: this.calculateProjectedYield(earningValue, yieldValue, harvestDuration),
      yieldPeriodApr: this.calculateProjectedYield(earningValue, yieldValuePerPeriod, duration),
      yieldTokens: yieldTokens.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, harvestDuration);
        return {
          apr,
          ...t,
        };
      }),
      yieldTokensPerPeriod: yieldTokensCurrent.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, duration);
        return {
          apr,
          ...t,
        };
      }),
      yieldValue,
    };
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

    if (vaultChartData.length === 0) return Array.from(snapshots);

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

  private static calculateProjectedYield(
    value: number,
    pendingValue: number,
    duration: number,
    compoundingValue = 0,
  ): number {
    if (duration === 0 || value === 0 || pendingValue === 0) {
      return 0;
    }
    const apr = (pendingValue / value) * (ONE_YEAR_MS / duration) * 100;
    if (compoundingValue === 0) {
      return apr;
    }
    const compoundingApr = (compoundingValue / value) * (ONE_YEAR_MS / duration);
    const periods = ONE_YEAR_MS / duration;
    return apr - compoundingApr + ((1 + compoundingApr / periods) ** periods - 1) * 100;
  }
}
