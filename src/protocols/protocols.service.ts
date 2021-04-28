import { Service } from '@tsed/common';
import fetch from 'node-fetch';
import { CURVE_API_URL } from '../config/constants';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { ValueSource } from './interfaces/value-source.interface';
import { getVaultValueSources } from './protocols.utils';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolsService {
  /**
   * Retrieve performance of underlying protocol for a given sett.
   * @param sett Sett to retrieve protocol performance.
   */
  async getProtocolPerformance(sett: SettDefinition): Promise<ValueSource[]> {
    if (!sett.protocol) {
      return [];
    }
    return getVaultValueSources(sett);
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
    const assetKey = sett.symbol.toLocaleLowerCase();
    const tradeFeePerformance = {
      oneDay: curveData.apy.day[assetMap[assetKey]] * 100,
      threeDay: curveData.apy.day[assetMap[assetKey]] * 100,
      sevenDay: curveData.apy.week[assetMap[assetKey]] * 100,
      thirtyDay: curveData.apy.month[assetMap[assetKey]] * 100,
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
