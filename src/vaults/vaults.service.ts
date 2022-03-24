import { Currency, Protocol, VaultDTO, VaultState, VaultType } from '@badger-dao/sdk';
import { VaultYieldProjection } from '@badger-dao/sdk/lib/api/interfaces/vault-yield-projection.interface';
import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { ONE_YEAR_SECONDS } from '../config/constants';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getCachedTokenBalances } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { VaultPendingHarvestData } from './types/vault-pending-harvest-data';
import { getCachedVault, getVaultCachedValueSources, getVaultPendingHarvest, VAULT_SOURCE } from './vaults.utils';

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
    return Promise.all(chain.vaults.map((vault) => this.getVault(chain, vault, currency)));
  }

  async getVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<VaultDTO> {
    return VaultsService.loadVault(chain, vaultDefinition, currency);
  }

  static async loadVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<VaultDTO> {
    const [vault, sources, pendingHarvest, tokens] = await Promise.all([
      getCachedVault(chain, vaultDefinition),
      getVaultCachedValueSources(vaultDefinition),
      getVaultPendingHarvest(vaultDefinition),
      getCachedTokenBalances(vaultDefinition, currency),
    ]);
    vault.tokens = tokens;
    vault.value = await convert(vault.value, currency);
    const baseSources = sources
      .filter((source) => source.apr >= 0.001)
      .filter((source) => {
        if (source.name !== VAULT_SOURCE) {
          return true;
        }
        return vault.state !== VaultState.Deprecated && !vaultDefinition.deprecated;
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
    vault.yieldProjection = this.getVaultYieldProjection(vault, pendingHarvest);
    vault.lastHarvest = pendingHarvest.lastHarvestedAt;

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

  private static getVaultYieldProjection(
    vault: VaultDTO,
    pendingHarvest: VaultPendingHarvestData,
  ): VaultYieldProjection {
    const { value, lastHarvest } = vault;
    const harvestValue = pendingHarvest.harvestTokens.reduce((total, token) => (total += token.value), 0);
    const yieldValue = pendingHarvest.yieldTokens.reduce((total, token) => (total += token.value), 0);
    return {
      harvestApr: this.calculateProjectedYield(value, harvestValue, lastHarvest),
      harvestApy: this.calculateProjectedYield(value, harvestValue, lastHarvest),
      harvestTokens: pendingHarvest.harvestTokens,
      harvestValue,
      yieldApr: this.calculateProjectedYield(value, yieldValue, lastHarvest),
      yieldTokens: pendingHarvest.yieldTokens,
      yieldValue,
    };
  }

  private static calculateProjectedYield(value: number, pendingValue: number, lastHarvested: number): number {
    if (lastHarvested === 0) {
      return 0;
    }
    const duration = Date.now() / 1000 - lastHarvested;
    return (pendingValue / value) * (ONE_YEAR_SECONDS / duration) * 100;
  }
}
