import { Inject, Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import * as AWS from 'aws-sdk';
import * as E from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { pipe } from 'fp-ts/lib/pipeable';
import fetch from 'node-fetch';
import { query } from '../aws/dynamodb-utils';
import { CacheService } from '../cache/CacheService';
import { Chain } from '../chains/config/chain.config';
import { APY_SNAPSHOTS_DATA, CURVE_API_URL, ONE_MINUTE_MS, Protocol } from '../config/constants';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { cachedValueSourceToValueSource } from './common/value-source.utils';
import { CachedValueSource } from './interfaces/cached-value-source.interface';
import { ValueSource } from './interfaces/value-source.interface';
import { PancakeSwapService } from './pancake/PancakeSwapService';
import { SushiswapService } from './sushi/SushiswapService';
import { UniswapService } from './uni/UniswapService';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolsService {
  @Inject()
  uniswapService!: UniswapService;
  @Inject()
  sushiswapService!: SushiswapService;
  @Inject()
  pancakeSwapService!: PancakeSwapService;
  @Inject()
  cacheService!: CacheService;

  /**
   * Retrieve performance of underlying protocol for a given sett.
   * @param sett Sett to retrieve protocol performance.
   */
  async getProtocolPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    if (!sett.protocol) {
      return [];
    }

    const latestValueSourceSnapshots = await query({
      TableName: APY_SNAPSHOTS_DATA,
      IndexName: 'IndexApySnapshotsOnAddress',
      KeyConditionExpression: '#address = :address',
      ExpressionAttributeValues: {
        ':address': { S: sett.settToken },
      },
      ExpressionAttributeNames: {
        '#address': 'address',
      },
    });

    if (latestValueSourceSnapshots && latestValueSourceSnapshots.Items && latestValueSourceSnapshots.Items.length > 0) {
      const snapshots = latestValueSourceSnapshots.Items.map((item) => {
        const record = AWS.DynamoDB.Converter.unmarshall(item);
        return pipe(
          record,
          CachedValueSource.decode,
          E.fold((errors) => {
            throw new InternalServerError(errors.join(' '));
          }, identity),
        );
      });

      if (Date.now() - snapshots[0].updatedAt <= ONE_MINUTE_MS) {
        return snapshots.map((snapshot) => cachedValueSourceToValueSource(snapshot));
      }
    }

    const cacheKey = CacheService.getCacheKey(chain.name, sett.name);
    const cachedData = this.cacheService.get<ValueSource[]>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    let valueSources: ValueSource[];
    switch (sett.protocol) {
      case Protocol.Curve:
        valueSources = await ProtocolsService.getCurvePerformance(sett);
        break;
      case Protocol.Uniswap:
        valueSources = await this.uniswapService.getPairPerformance(chain, sett);
        break;
      case Protocol.Sushiswap:
        valueSources = await this.sushiswapService.getPairPerformance(chain, sett);
        break;
      case Protocol.Pancakeswap:
        valueSources = await this.pancakeSwapService.getPairPerformance(chain, sett);
        break;
      default:
        return [];
    }

    this.cacheService.set(cacheKey, valueSources);
    return valueSources;
  }

  /**
   * Retrieve Curve DAO pool performance from trading fees.
   * @param sett Sett to retrieve curve performance for.
   */
  static async getCurvePerformance(sett: SettDefinition): Promise<ValueSource[]> {
    const assetMap: { [asset: string]: string } = {
      hrenbtccrv: 'ren2',
      renbtccrv: 'ren2',
      sbtccrv: 'rens',
      tbtccrv: 'tbtc',
    };

    const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
    const tradeFeePerformance = {
      oneDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      threeDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      sevenDay: curveData.apy.week[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      thirtyDay: curveData.apy.month[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
    };
    return [
      {
        name: 'Curve LP Fees',
        apy: tradeFeePerformance.threeDay,
        performance: tradeFeePerformance,
      },
    ];
  }
}
