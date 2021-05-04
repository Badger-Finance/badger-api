import { Inject, Service } from '@tsed/common';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { CURRENT, ONE_DAY, SEVEN_DAYS, THIRTY_DAYS, THREE_DAYS } from '../config/constants';
import { scalePerformance } from '../protocols/interfaces/performance.interface';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultValueSources } from '../protocols/protocols.utils';
import { TokenType } from '../tokens/enums/token-type.enum';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { TokensService } from '../tokens/tokens.service';
import { getSettTokens, getToken } from '../tokens/tokens.utils';
import { Sett } from './interfaces/sett.interface.';
import { SettDefinition } from './interfaces/sett-definition.interface';
import { getCachcedSett, getPerformance, getSettDefinition, getSettSnapshots, VAULT_SOURCE } from './setts.utils';

@Service()
export class SettsService {
  @Inject()
  private readonly tokensSerivce!: TokensService;

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
    const sett = await getCachcedSett(settDefinition);
    const tokenRequest: TokenRequest = {
      chain: chain,
      sett: settDefinition,
      balance: sett.balance,
      currency: currency,
    };
    sett.tokens = await this.tokensSerivce.getSettTokens(tokenRequest);
    sett.value = sett.tokens.reduce((total, balance) => (total += balance.value), 0);

    let sources = await getVaultValueSources(settDefinition);
    if (chain.name === 'BinanceSmartChain') {
      sources = sources.filter((source) => source.name !== VAULT_SOURCE);
    } else {
      sources = sources.filter((source) => !source.harvestable);
    }
    sett.sources = sources.filter((source) => source.apr > 0);
    sett.apy = sett.sources.map((s) => s.apr).reduce((total, apr) => (total += apr), 0);

    // TODO: Re-enable this once its better offlined (or used again)
    // if (settDefinition.affiliate) {
    //   const affiliate = Affiliate.getAffiliate(settDefinition.affiliate);
    //   sett.affiliate = await affiliate.getAffiliateVaultData(chain, settDefinition);
    // }
    return sett;
  }

  static async getSettPerformance(settDefinition: SettDefinition): Promise<ValueSource> {
    const snapshots = await getSettSnapshots(settDefinition);
    const current = snapshots[CURRENT];
    const performance = {
      oneDay: getPerformance(current, snapshots[ONE_DAY]),
      threeDay: getPerformance(current, snapshots[THREE_DAYS]),
      sevenDay: getPerformance(current, snapshots[SEVEN_DAYS]),
      thirtyDay: getPerformance(current, snapshots[THIRTY_DAYS]),
    };
    return createValueSource(VAULT_SOURCE, performance);
  }

  static async getSettTokenPerformance(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource[]> {
    const sett = await getCachcedSett(settDefinition);
    const tokens = await getSettTokens(chain, settDefinition);
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
