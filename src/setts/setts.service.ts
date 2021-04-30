import { Inject, Service } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Affiliate } from '../affiliates/config/affiliate.config';
import { Chain } from '../chains/config/chain.config';
import { CURRENT, ONE_DAY, ONE_YEAR_MS, SEVEN_DAYS, THIRTY_DAYS, THREE_DAYS } from '../config/constants';
import { Performance, scalePerformance, uniformPerformance } from '../protocols/interfaces/performance.interface';
import { ProtocolSummary } from '../protocols/interfaces/protocol-summary.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { ProtocolsService } from '../protocols/protocols.service';
import { TokenType } from '../tokens/enums/token-type.enum';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { TokensService } from '../tokens/tokens.service';
import { getToken } from '../tokens/tokens.utils';
import { Sett } from './interfaces/sett.interface.';
import { SettSnapshot } from './interfaces/sett-snapshot.interface';
import { SettSummary } from './interfaces/sett-summary.interface';
import { getCachcedSett, getSettSnapshots, VAULT_SOURCE } from './setts.utils';

@Service()
export class SettsService {
  @Inject()
  private readonly protocolsService!: ProtocolsService;
  @Inject()
  private readonly tokensSerivce!: TokensService;

  async getProtocolSummary(chain: Chain, currency?: string): Promise<ProtocolSummary> {
    const setts = await this.listSetts(chain, currency);
    const settSummaries: SettSummary[] = setts.map((s) => ({
      balance: s.balance,
      name: s.name,
      value: s.value,
    }));
    const totalValue = settSummaries.map((s) => s.value).reduce((total, value) => (total += value), 0);
    return { totalValue: totalValue, setts: settSummaries };
  }

  async listSetts(chain: Chain, currency?: string): Promise<Sett[]> {
    const settNames = Object.values(chain.setts).map((s) => s.symbol.toLocaleLowerCase());
    return await Promise.all(settNames.map((s) => this.getSett(chain, s, currency)));
  }

  async getSett(chain: Chain, settName: string, currency?: string): Promise<Sett> {
    if (!settName) {
      throw new BadRequest('settName is required');
    }
    const asset = settName.toLowerCase();
    const settDefinition = chain.setts.find((s) => s.symbol.toLowerCase() === asset);

    if (!settDefinition) {
      throw new NotFound(`${settName} is not a valid sett`);
    }

    const sett: Sett = {
      asset: settDefinition.symbol,
      apy: 0,
      balance: 0,
      hasBouncer: !!settDefinition.hasBouncer,
      name: settDefinition.name,
      ppfs: 1,
      sources: [],
      tokens: [],
      underlyingToken: settDefinition.depositToken,
      value: 0,
      vaultToken: settDefinition.settToken,
    };

    // Set to current balance, fallback to snapshot
    const [settSnapshots, latestSettRecord] = await Promise.all([
      getSettSnapshots(settDefinition),
      getCachcedSett(settDefinition),
    ]);

    sett.balance = latestSettRecord.balance;
    sett.ppfs = latestSettRecord.ratio;
    let filterHarvestablePerformances = false;

    // check for historical performance data
    if (chain.name != 'BinanceSmartChain' && settSnapshots.length > 0) {
      const settValueSource = this.getSettUnderlyingValueSource(settSnapshots);

      // sett has measurable apy, replace underlying with measured actual apy
      if (settValueSource.apr > 0) {
        sett.sources.push(settValueSource);
        filterHarvestablePerformances = true;
      }
    }

    const tokenRequest: TokenRequest = {
      chain: chain,
      sett: settDefinition,
      balance: sett.balance,
      currency: currency,
    };

    const [protocolValueSource, settTokens] = await Promise.all([
      this.protocolsService.getProtocolPerformance(settDefinition),
      this.tokensSerivce.getSettTokens(tokenRequest),
    ]);

    if (protocolValueSource) {
      sett.sources.push(...protocolValueSource);
    }

    sett.tokens = settTokens;
    sett.value = sett.tokens.reduce((total, tokenBalance) => (total += tokenBalance.value), 0);

    const vaultToken = getToken(sett.vaultToken);
    await Promise.all(
      sett.tokens.map(async (tokenBalance) => {
        const token = getToken(tokenBalance.address);
        if (token.type === TokenType.Wrapper && token.vaultToken) {
          const { network, symbol, address } = token.vaultToken;
          const chain = Chain.getChain(network);
          const vault = await this.getSett(chain, symbol, currency);
          vault.sources.forEach((source) => {
            if (source.name === VAULT_SOURCE) {
              const backingVault = chain.setts.find((sett) => ethers.utils.getAddress(sett.depositToken) === address);
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
            }
          });
          sett.sources.push(...vault.sources);
        }
      }),
    );

    sett.sources = sett.sources.filter((source) => {
      const report = source.apr > 0;
      if (filterHarvestablePerformances) {
        return !source.harvestable && report;
      }
      return report;
    });
    sett.apy = sett.sources.map((s) => s.apr).reduce((total, apy) => (total += apy), 0);

    // check for a new vault, no ppfs measurement
    if (sett.sources.length === 0) {
      sett.sources.push(createValueSource('New Vault Offering', uniformPerformance(0)));
    }

    if (settDefinition.affiliate) {
      const affiliate = Affiliate.getAffiliate(settDefinition.affiliate);
      sett.affiliate = await affiliate.getAffiliateVaultData(chain, settDefinition);
    }

    return sett;
  }

  getSettUnderlyingValueSource(settSnapshots: SettSnapshot[]): ValueSource {
    const settPerformance: Performance = {
      oneDay: this.getSettSampledPerformance(settSnapshots, ONE_DAY),
      threeDay: this.getSettSampledPerformance(settSnapshots, THREE_DAYS),
      sevenDay: this.getSettSampledPerformance(settSnapshots, SEVEN_DAYS),
      thirtyDay: this.getSettSampledPerformance(settSnapshots, THIRTY_DAYS),
    };
    return createValueSource(VAULT_SOURCE, settPerformance);
  }

  getSettSampledPerformance(settSnapshots: SettSnapshot[], sampleIndex: number): number {
    const currentSnapshot = settSnapshots[CURRENT];
    if (sampleIndex > settSnapshots.length - 1) {
      return 0;
    }
    const sampledSnapshot = settSnapshots[sampleIndex];
    const ratioDiff = currentSnapshot.ratio - sampledSnapshot.ratio;
    const timestampDiff = currentSnapshot.timestamp - sampledSnapshot.timestamp;
    const scalar = ONE_YEAR_MS / timestampDiff;
    const finalRatio = sampledSnapshot.ratio + scalar * ratioDiff;
    return ((finalRatio - sampledSnapshot.ratio) / sampledSnapshot.ratio) * 100;
  }
}
