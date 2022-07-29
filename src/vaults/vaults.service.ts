import { ChartTimeFrame, Currency, Protocol, VaultDTO, VaultSnapshot, VaultState, VaultType } from '@badger-dao/sdk';
import { VaultYieldProjection } from '@badger-dao/sdk/lib/api/interfaces/vault-yield-projection.interface';
import { MetadataClient } from '@badger-dao/sdk/lib/registry.v2/enums/metadata.client.enum';
import { Service } from '@tsed/common';
import { ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { HarvestCompoundData } from '../aws/models/harvest-compound.model';
import { HistoricVaultSnapshotModel } from '../aws/models/historic-vault-snapshot.model';
import { VaultPendingHarvestData } from '../aws/models/vault-pending-harvest.model';
import { Chain, isStageVault } from '../chains/config/chain.config';
import { toChartDataKey } from '../charts/charts.utils';
import { ONE_YEAR_SECONDS } from '../config/constants';
import { NodataForVaultError } from '../errors/allocation/nodata.for.vault.error';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getCachedTokenBalances } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { VaultHarvestsExtendedResp } from './interfaces/vault-harvest-extended-resp.interface';
import { VaultHarvestsMap } from './interfaces/vault-harvest-map';
import {
  getCachedVault,
  getVaultCachedValueSources,
  getVaultDefinition,
  getVaultPendingHarvest,
  getVaultSnapshotsAtTimestamps,
  queryVaultCharts,
  VAULT_SOURCE,
  vaultCompoundToDefinition,
} from './vaults.utils';

@Service()
export class VaultsService {
  async getProtocolSummary(chain: Chain, currency?: Currency): Promise<ProtocolSummary> {
    const vaults = await Promise.all(
      chain.vaults.map(async (vault) => {
        const { name, balance, value } = await getCachedVault(chain, vault);
        const convertedValue = await convert(value, currency);
        return { name, balance, value: convertedValue };
      }),
    );
    const totalValue = vaults.reduce((total, vault) => (total += vault.value), 0);
    return { totalValue, vaults, setts: vaults };
  }

  async listVaults(chain: Chain, currency?: Currency): Promise<VaultDTO[]> {
    return Promise.all(chain.vaults.filter(isStageVault).map((vault) => this.getVault(chain, vault, currency)));
  }

  async listV3Vaults(chain: Chain, currency?: Currency, client?: MetadataClient): Promise<VaultDTO[]> {
    let chainVaults = await chain.vaultsCompound.all();

    if (client) chainVaults = chainVaults.filter((v) => v.client === client);

    return Promise.all(
      chainVaults.map((vault) => {
        return this.getVault(chain, vaultCompoundToDefinition(vault), currency);
      }),
    );
  }

  async getVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<VaultDTO> {
    return VaultsService.loadVault(chain, vaultDefinition, currency);
  }

  async listVaultHarvests(chain: Chain): Promise<VaultHarvestsMap> {
    const harvestsWithSnapshots = await Promise.all(
      chain.vaults.map(async (vault) => {
        return {
          vault: vault.vaultToken,
          harvests: await this.getVaultHarvests(chain, vault.vaultToken),
        };
      }),
    );

    return harvestsWithSnapshots.reduce((acc, harvestWithSnapshot) => {
      acc[harvestWithSnapshot.vault] = harvestWithSnapshot.harvests;
      return acc;
    }, <VaultHarvestsMap>{});
  }

  async getVaultHarvests(chain: Chain, vaultAddr: VaultDefinition['vaultToken']): Promise<VaultHarvestsExtendedResp[]> {
    const vaultHarvests: VaultHarvestsExtendedResp[] = [];

    const mapper = getDataMapper();

    vaultAddr = ethers.utils.getAddress(vaultAddr);

    const vaultDef = getVaultDefinition(chain, vaultAddr);

    if (!vaultDef) {
      throw new NodataForVaultError(`${vaultAddr}`);
    }

    const queryHarvests = mapper.query(
      HarvestCompoundData,
      { vault: vaultDef.vaultToken },
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
      console.error(`Failed to get compound harvest from ddb for vault ${vaultDef.vaultToken}; ${e}`);
    }

    return vaultHarvests;
  }

  static async loadVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<VaultDTO> {
    const [vault, sources, pendingHarvest] = await Promise.all([
      getCachedVault(chain, vaultDefinition),
      getVaultCachedValueSources(vaultDefinition),
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
    const passiveSources = sourcesApr.filter((s) => s.type === SourceType.TradeFee || s.type === SourceType.Emission);
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
    harvestProjection.yieldApr += passiveSourcesApr;
    harvestProjection.harvestApr += passiveSourcesApr;
    harvestProjection.harvestApy += passiveSourcesApr;

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

  async getVaultSnapshots(chain: Chain, vault: VaultDefinition, timestamps: number[]): Promise<VaultSnapshot[]> {
    return getVaultSnapshotsAtTimestamps(chain, vault, timestamps);
  }

  public static getVaultYieldProjection(
    // refactor regV2, Data Objects interfaces should be in api alongside with models
    vault: Pick<VaultDTO, 'value' | 'balance' | 'available' | 'lastHarvest' | 'underlyingToken'>,
    pendingHarvest: VaultPendingHarvestData,
  ): VaultYieldProjection {
    const { value, balance, available, lastHarvest } = vault;

    const harvestValue = pendingHarvest.harvestTokens.reduce((total, token) => (total += token.value), 0);
    const yieldValue = pendingHarvest.yieldTokens.reduce((total, token) => (total += token.value), 0);
    const harvestCompoundValue = pendingHarvest.harvestTokens
      .filter((t) => vault.underlyingToken === t.address)
      .reduce((total, token) => (total += token.value), 0);

    const earningValue = balance > 0 ? value * ((balance - available) / balance) : 0;
    return {
      harvestApr: this.calculateProjectedYield(earningValue, harvestValue, lastHarvest),
      harvestApy: this.calculateProjectedYield(earningValue, harvestValue, lastHarvest, harvestCompoundValue),
      harvestTokens: pendingHarvest.harvestTokens.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, lastHarvest);
        return {
          apr,
          ...t,
        };
      }),
      harvestValue,
      yieldApr: this.calculateProjectedYield(earningValue, yieldValue, lastHarvest),
      yieldTokens: pendingHarvest.yieldTokens.map((t) => {
        const apr = this.calculateProjectedYield(earningValue, t.value, lastHarvest);
        return {
          apr,
          ...t,
        };
      }),
      yieldValue,
    };
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

  private static calculateProjectedYield(
    value: number,
    pendingValue: number,
    lastHarvested: number,
    compoundingValue = 0,
  ): number {
    if (lastHarvested === 0 || value === 0 || pendingValue === 0) {
      return 0;
    }
    const duration = Date.now() / 1000 - lastHarvested;
    const apr = (pendingValue / value) * (ONE_YEAR_SECONDS / duration) * 100;
    if (compoundingValue === 0) {
      return apr;
    }
    const compoundingApr = (compoundingValue / value) * (ONE_YEAR_SECONDS / duration);
    const periods = ONE_YEAR_SECONDS / duration;
    return apr + ((1 + compoundingApr / periods) ** periods - 1) * 100;
  }
}
