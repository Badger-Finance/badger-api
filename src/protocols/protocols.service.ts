import { Service } from '@tsed/common';
import fetch from 'node-fetch';
import { CURVE_API_URL } from '../config/constants';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getToken } from '../tokens/tokens.utils';
import { createValueSource, ValueSource } from './interfaces/value-source.interface';

/**
 * External protocol performance retrieval service.
 */
@Service()
export class ProtocolsService {
  /**
   * Retrieve Curve DAO pool performance from trading fees.
   * @param settDefinition Sett to retrieve curve performance for.
   */
  static async getCurvePerformance(settDefinition: SettDefinition): Promise<ValueSource[]> {
    const assetMap: { [asset: string]: string } = {
      hrenbtccrv: 'ren2',
      renbtccrv: 'ren2',
      sbtccrv: 'rens',
      tbtccrv: 'tbtc',
    };

    const settToken = getToken(settDefinition.settToken);
    const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
    const assetKey = settToken.symbol.toLocaleLowerCase();
    const tradeFeePerformance = {
      oneDay: curveData.apy.day[assetMap[assetKey]] * 100,
      threeDay: curveData.apy.day[assetMap[assetKey]] * 100,
      sevenDay: curveData.apy.week[assetMap[assetKey]] * 100,
      thirtyDay: curveData.apy.month[assetMap[assetKey]] * 100,
    };
    return [createValueSource('Curve LP Fees', tradeFeePerformance)];
  }
}
