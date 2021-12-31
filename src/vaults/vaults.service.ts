import { Protocol, Vault, VaultState, VaultType } from '@badger-dao/sdk';
import { Service } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { CURRENT, ONE_DAY_MS } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultValueSources } from '../protocols/protocols.utils';
import { SOURCE_TIME_FRAMES, updatePerformance } from '../rewards/enums/source-timeframe.enum';
import { getVaultTokens } from '../tokens/tokens.utils';
import { VaultDefinition } from './interfaces/vault-definition.interface';
import { getCachedVault, getPerformance, getVaultDefinition, getSettSnapshots, VAULT_SOURCE } from './vaults.utils';

@Service()
export class VaultsService {
  async getProtocolSummary(chain: Chain, currency?: string): Promise<ProtocolSummary> {
    const setts = await Promise.all(
      chain.setts.map(async (sett) => {
        const { name, balance, value } = await this.getSett(chain, sett.settToken, currency);
        return { name, balance, value };
      }),
    );
    const totalValue = setts.reduce((total, sett) => (total += sett.value), 0);
    return { totalValue, setts };
  }

  async listSetts(chain: Chain, currency?: string): Promise<Vault[]> {
    return Promise.all(chain.setts.map((sett) => this.getSett(chain, sett.settToken, currency)));
  }

  async getSett(chain: Chain, contract: string, currency?: string): Promise<Vault> {
    const vaultDefinition = getVaultDefinition(chain, contract);
    const [vault, sources] = await Promise.all([
      getCachedVault(vaultDefinition),
      getVaultValueSources(vaultDefinition),
    ]);
    vault.tokens = await getVaultTokens(vaultDefinition, vault.balance, currency);
    vault.value = vault.tokens.reduce((total, balance) => (total += balance.value), 0);
    vault.sources = sources
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

  static async getSettPerformance(vaultDefinition: VaultDefinition): Promise<ValueSource> {
    const snapshots = await getSettSnapshots(vaultDefinition);
    const current = snapshots[CURRENT];
    if (current === undefined) {
      return createValueSource(VAULT_SOURCE, uniformPerformance(0));
    }
    const start = Date.now();
    const performance = uniformPerformance(0);

    let timeframeIndex = 0;
    for (let i = 0; i < snapshots.length; i++) {
      const currentTimeFrame = SOURCE_TIME_FRAMES[timeframeIndex];
      const currentCutoff = start - currentTimeFrame * ONE_DAY_MS;
      const currentSnapshot = snapshots[i];
      if (currentSnapshot.timestamp <= currentCutoff) {
        updatePerformance(performance, currentTimeFrame, getPerformance(current, currentSnapshot));
        if (vaultDefinition.depositToken === TOKENS.DIGG) {
          console.log({ performance, timeframeIndex: SOURCE_TIME_FRAMES[timeframeIndex], current, currentSnapshot });
          console.log({
            start: new Date(current.timestamp * 1000).toLocaleString(),
            end: new Date(currentSnapshot.timestamp * 1000).toLocaleString(),
          });
        }
        timeframeIndex += 1;
        if (timeframeIndex >= SOURCE_TIME_FRAMES.length) {
          break;
        }
      }
    }

    // handle no valid measurements, measure available data
    if (timeframeIndex < SOURCE_TIME_FRAMES.length) {
      updatePerformance(
        performance,
        SOURCE_TIME_FRAMES[timeframeIndex],
        getPerformance(current, snapshots[snapshots.length - 1]),
      );
    }

    return createValueSource(VAULT_SOURCE, performance);
  }
}
