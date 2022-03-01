import { Currency, Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { convert } from '../prices/prices.utils';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { getVaultCachedValueSources } from '../protocols/protocols.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVaultTokens } from '../tokens/tokens.utils';
import { getCachedVault, getVaultDefinition, VAULT_SOURCE } from './vaults.utils';

@Service()
export class VaultsService {
  async getProtocolSummary(chain: Chain, currency?: Currency): Promise<ProtocolSummary> {
    const vaults = await Promise.all(
      chain.vaults.map(async (vault) => {
        const { name, balance, value } = await getCachedVault(vault);
        const convertedValue = await convert(value, currency);
        return { name, balance, value: convertedValue };
      }),
    );
    const totalValue = vaults.reduce((total, vault) => (total += vault.value), 0);
    return { totalValue, vaults, setts: vaults };
  }

  async listVaults(chain: Chain, currency?: Currency): Promise<Vault[]> {
    return Promise.all(chain.vaults.map((vault) => this.getVault(chain, vault.vaultToken, currency)));
  }

  async getVault(chain: Chain, contract: string, currency?: Currency): Promise<Vault> {
    const vaultDefinition = getVaultDefinition(chain, contract);
    const [vault, sources] = await Promise.all([
      getCachedVault(vaultDefinition),
      getVaultCachedValueSources(vaultDefinition),
    ]);
    vault.tokens = await getVaultTokens(vaultDefinition, vault.balance, currency);
    vault.value = await convert(vault.value, currency);
    vault.sources = sources
      .filter((source) => source.type !== SourceType.PreCompound)
      .map((source) => source.toValueSource())
      .filter((source) => source.apr >= 0.001)
      .filter((source) => {
        if (source.name !== VAULT_SOURCE) {
          return true;
        }
        return vault.state !== VaultState.Deprecated && !vaultDefinition.deprecated;
      });
    vault.apr = vault.sources.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
    vault.protocol = vaultDefinition.protocol ?? Protocol.Badger;

    if (vault.boost.enabled) {
      const hasBoostedApr = vault.sources.some((source) => source.boostable);
      if (hasBoostedApr) {
        vault.minApr = vault.sources.map((s) => s.minApr || s.apr).reduce((total, apr) => (total += apr), 0);
        vault.maxApr = vault.sources.map((s) => s.maxApr || s.apr).reduce((total, apr) => (total += apr), 0);
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
