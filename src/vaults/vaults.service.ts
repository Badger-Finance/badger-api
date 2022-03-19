import { Currency, Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { getVaultCachedValueSources } from '../protocols/protocols.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVaultTokens } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { getCachedVault, VAULT_SOURCE } from './vaults.utils';

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

  async listVaults(chain: Chain, currency?: Currency): Promise<Vault[]> {
    return Promise.all(chain.vaults.map((vault) => this.getVault(chain, vault, currency)));
  }

  async getVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<Vault> {
    return VaultsService.loadVault(chain, vaultDefinition, currency);
  }

  static async loadVault(chain: Chain, vaultDefinition: VaultDefinition, currency?: Currency): Promise<Vault> {
    const [vault, sources] = await Promise.all([
      getCachedVault(chain, vaultDefinition),
      getVaultCachedValueSources(vaultDefinition),
    ]);
    vault.tokens = await getVaultTokens(chain, vaultDefinition, vault.balance, currency);
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
}
