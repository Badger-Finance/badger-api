import { Inject, Service } from '@tsed/common';
import { BadRequest, InternalServerError, NotFound } from '@tsed/exceptions';
import * as AWS from 'aws-sdk';
import { ethers } from 'ethers';
import * as E from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import { query } from '../aws/dynamodb-utils';
import { Chain } from '../chains/config/chain.config';
import {
  ASSET_DATA,
  CURRENT,
  ONE_DAY,
  ONE_MINUTE_MS,
  ONE_YEAR_MS,
  SAMPLE_DAYS,
  SETT_SNAPSHOTS_DATA,
  SEVEN_DAYS,
  THIRTY_DAYS,
  THREE_DAYS,
  TOKENS,
} from '../config/constants';
import { getAssetData } from '../config/util';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { Sett, SettSummary } from '../interface/Sett';
import { SettSnapshot } from '../interface/SettSnapshot';
import { Performance, scalePerformance } from '../protocols/interfaces/performance.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { ProtocolsService } from '../protocols/ProtocolsService';
import { TokenType } from '../tokens/enums/token-type.enum';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { getToken } from '../tokens/tokens-util';
import { TokensService } from '../tokens/TokensService';
import { CachedSettSnapshot } from './interfaces/cached-sett-snapshot.interface';
import { getSett, VAULT_SOURCE } from './setts-util';

@Service()
export class SettsService {
  @Inject()
  private readonly protocolsService!: ProtocolsService;
  @Inject()
  private readonly tokensSerivce!: TokensService;

  async getProtocolSummary(chain: Chain, currency?: string): Promise<ProtocolSummary> {
    const setts = await this.listSetts(chain, currency);
    const settSummaries = setts.map(
      (s) =>
        ({
          name: s.name,
          asset: s.asset,
          value: s.value,
          tokens: s.tokens,
        } as SettSummary),
    );
    const totalValue = settSummaries.map((s) => s.value).reduce((total, value) => (total += value), 0);
    return {
      totalValue: totalValue,
      setts: settSummaries,
    };
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
      name: settDefinition.name,
      asset: settDefinition.symbol,
      vaultToken: settDefinition.settToken,
      underlyingToken: settDefinition.depositToken,
      ppfs: 1,
      value: 0,
      apy: 0,
      tokens: [],
      sources: [],
    };

    // Set to current balance, fallback to snapshot
    let balance = 0;
    const [settSnapshots, latestSettRecord] = await Promise.all([
      this.getSettSnapshots(settName, SAMPLE_DAYS),
      query({
        TableName: SETT_SNAPSHOTS_DATA,
        KeyConditionExpression: '#address = :address',
        ExpressionAttributeValues: {
          ':address': { S: settDefinition.settToken },
        },
        ExpressionAttributeNames: {
          '#address': 'address',
        },
      }),
    ]);

    if (latestSettRecord && latestSettRecord.Items && latestSettRecord.Items.length > 0) {
      const item = AWS.DynamoDB.Converter.unmarshall(latestSettRecord.Items[0]);
      const settSnapshot = pipe(
        item,
        CachedSettSnapshot.decode,
        E.fold((errors) => {
          throw new InternalServerError(errors.join(' '));
        }, identity),
      );
      let supply = settSnapshot.supply;
      balance = settSnapshot.balance;

      if (Date.now() - settSnapshot.updatedAt > ONE_MINUTE_MS) {
        const { sett } = await getSett(chain.graphUrl, settDefinition.settToken);
        if (sett) {
          ({ balance, totalSupply: supply } = sett);
        }
      }

      sett.ppfs = balance / supply;
    } else if (settSnapshots.length > 0) {
      const latestSett = settSnapshots[CURRENT];
      balance = latestSett.balance;
      if (settDefinition.depositToken === TOKENS.DIGG) {
        sett.ppfs = latestSett.supply / latestSett.balance;
      } else {
        sett.ppfs = latestSett.ratio;
      }
    }

    let filterHarvestablePerformances = false;

    // check for historical performance data
    if (chain.name != 'BinanceSmartChain' && settSnapshots.length > 0) {
      const settValueSource = this.getSettUnderlyingValueSource(settSnapshots);

      // sett has measurable apy, replace underlying with measured actual apy
      if (settValueSource.apy > 0) {
        sett.sources.push(settValueSource);
        filterHarvestablePerformances = true;
      }
    }

    const tokenRequest: TokenRequest = {
      chain: chain,
      sett: settDefinition,
      balance: balance,
      currency: currency,
    };

    const [protocolValueSource, settTokens] = await Promise.all([
      this.protocolsService.getProtocolPerformance(chain, settDefinition),
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
                source.apy = 0;
                return;
              }
              const bToken = getToken(backingVault.settToken);
              source.name = `${chain.name} ${bToken.name} Deposit`;
              if (vaultToken.lpToken) {
                source.apy /= 2;
                source.performance = scalePerformance(source.performance, 0.5);
              }
            }
          });
          sett.sources.push(...vault.sources);
        }
      }),
    );

    sett.sources = sett.sources.filter((source) => {
      const report = source.apy > 0;
      if (filterHarvestablePerformances) {
        return !source.harvestable && report;
      }
      return report;
    });
    sett.apy = sett.sources.map((s) => s.apy).reduce((total, apy) => (total += apy), 0);
    return sett;
  }

  async getSettSnapshots(settName: string, count?: number): Promise<SettSnapshot[]> {
    const snapshots = await getAssetData(ASSET_DATA, settName.toLowerCase(), count);
    if (!snapshots) {
      throw new NotFound(`${settName} is not a valid sett`);
    }
    return snapshots;
  }

  getSettUnderlyingValueSource(settSnapshots: SettSnapshot[]): ValueSource {
    const settPerformance: Performance = {
      oneDay: this.getSettSampledPerformance(settSnapshots, ONE_DAY),
      threeDay: this.getSettSampledPerformance(settSnapshots, THREE_DAYS),
      sevenDay: this.getSettSampledPerformance(settSnapshots, SEVEN_DAYS),
      thirtyDay: this.getSettSampledPerformance(settSnapshots, THIRTY_DAYS),
    };
    return {
      name: VAULT_SOURCE,
      apy: settPerformance.threeDay,
      performance: settPerformance,
    } as ValueSource;
  }

  getSettSampledPerformance(settSnapshots: SettSnapshot[], sampleIndex: number): number {
    const currentSnapshot = settSnapshots[CURRENT];
    if (sampleIndex > settSnapshots.length - 1) {
      return 0;
    }
    const sampledSnapshot = settSnapshots[sampleIndex];
    const ratioDiff = currentSnapshot.ratio - sampledSnapshot.ratio;
    const blockDiff = currentSnapshot.height - sampledSnapshot.height;
    const timestampDiff = currentSnapshot.timestamp - sampledSnapshot.timestamp;
    const slope = ratioDiff / blockDiff;
    const scalar = (ONE_YEAR_MS / timestampDiff) * blockDiff;
    return slope * scalar * 100;
  }
}
