import { Service } from '@tsed/common';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { CURRENT, ONE_DAY_MS } from '../config/constants';
import { scalePerformance, uniformPerformance } from '../protocols/interfaces/performance.interface';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultValueSources } from '../protocols/protocols.utils';
import { SOURCE_TIME_FRAMES, updatePerformance } from '../rewards/enums/source-timeframe.enum';
import { TokenType } from '../tokens/enums/token-type.enum';
import { getSettTokens, getSettUnderlyingTokens, getToken } from '../tokens/tokens.utils';
import { Sett } from './interfaces/sett.interface';
import { SettDefinition } from './interfaces/sett-definition.interface';
import {
  getCachedSett,
  getPerformance,
  getSettBoosts,
  getSettDefinition,
  getSettSnapshots,
  VAULT_SOURCE,
} from './setts.utils';

@Service()
export class SettsService {
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

  async listSetts(chain: Chain, currency?: string): Promise<Sett[]> {
    return Promise.all(chain.setts.map((sett) => this.getSett(chain, sett.settToken, currency)));
  }

  async getSett(chain: Chain, contract: string, currency?: string): Promise<Sett> {
    const settDefinition = getSettDefinition(chain, contract);
    const [sett, sources, boosts] = await Promise.all([
      getCachedSett(settDefinition),
      getVaultValueSources(settDefinition),
      getSettBoosts(settDefinition),
    ]);
    sett.tokens = await getSettTokens(settDefinition, sett.balance, currency);
    sett.value = sett.tokens.reduce((total, balance) => (total += balance.value), 0);
    sett.sources = sources
      .filter((source) => source.apr >= 0.001)
      .filter((source) => source.name !== VAULT_SOURCE || !sett.deprecated);
    sett.apr = sett.sources.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);
    sett.multipliers = boosts.map((b) => ({ boost: b.boost, multiplier: b.multiplier }));

    const hasBoostedApr = sett.sources.some((source) => source.boostable);
    if (hasBoostedApr) {
      sett.boostable = true;
      sett.minApr = sett.sources.map((s) => s.minApr || s.apr).reduce((total, apr) => (total += apr), 0);
      sett.maxApr = sett.sources.map((s) => s.maxApr || s.apr).reduce((total, apr) => (total += apr), 0);
    }

    return sett;
  }

  static async getSettPerformance(settDefinition: SettDefinition): Promise<ValueSource> {
    const snapshots = await getSettSnapshots(settDefinition);
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
        timeframeIndex += 1;
      }
    }

    return createValueSource(VAULT_SOURCE, performance);
  }

  static async getSettTokenPerformance(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource[]> {
    const sett = await getCachedSett(settDefinition);
    const tokens = await getSettUnderlyingTokens(chain, settDefinition);
    const vaultToken = getToken(sett.vaultToken);

    const sources: ValueSource[] = [];
    await Promise.all(
      tokens.map(async (token) => {
        if (token.type === TokenType.Wrapper && token.vaultToken) {
          const { network, address } = token.vaultToken;
          const chain = Chain.getChain(network);
          const settDefinition = getSettDefinition(chain, address);
          const vaultSources = await getVaultValueSources(settDefinition);
          vaultSources.forEach((source) => {
            if (source.name === VAULT_SOURCE) {
              const backingVault = chain.setts.find((sett) => ethers.utils.getAddress(sett.settToken) === address);
              if (!backingVault) {
                source.apr = 0;
                return;
              }
              const bToken = getToken(backingVault.settToken);
              source.name = `${chain.name} ${bToken.name} Deposit`;
              if (vaultToken.lpToken) {
                source.apr /= 2;
                source.performance = scalePerformance(source.performance, 0.5);
              }
              sources.push(source);
            }
          });
        }
      }),
    );
    return sources;
  }
}
