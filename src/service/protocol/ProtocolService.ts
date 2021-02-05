import { ValueSource } from "../../interface/ValueSource";
import { Performance } from "../../interface/Performance";
import { CURVE_API_URL } from "../../util/constants";
import { Service } from "@tsed/common";
import { SettData } from "../setts"; 
import fetch from "node-fetch";

@Service()
export class ProtocolService {

  async getProtocolPerformance(sett: SettData): Promise<ValueSource> {
    let protocolPerformance: Performance;

    switch (sett.protocol) {
      case "curve":
        protocolPerformance = await this.getCurvePerformance(sett);
        break;
      default:
        protocolPerformance = {
          oneDay: 0,
          threeDay: 0,
          sevenDay: 0,
          thirtyDay: 0,
        };
    }

    return {
      name: sett.protocol,
      apy: protocolPerformance.threeDay,
      performance: protocolPerformance,
    } as ValueSource;
  }

  private async getCurvePerformance(sett: SettData): Promise<Performance> {
    const assetMap = {
      hrenbtccrv: 'ren2',
      renbtccrv: 'ren2',
      sbtccrv: 'rens',
      tbtccrv: 'tbtc',
    } as Record<string, string>;

    const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
    return {
      oneDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      threeDay: curveData.apy.day[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      sevenDay: curveData.apy.week[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
      thirtyDay: curveData.apy.month[assetMap[sett.symbol.toLocaleLowerCase()]] * 100,
    } as Performance;
  }

  private async getUniswapPerformance(sett: SettData): Promise<Performance> {
    return {
      oneDay: 0,
      threeDay: 0,
      sevenDay: 0,
      thirtyDay: 0,
    } as Performance;
  }

  private async getSushiswapPerformance(sett: SettData): Promise<Performance> {
    return {
      oneDay: 0,
      threeDay: 0,
      sevenDay: 0,
      thirtyDay: 0,
    } as Performance;
  }
}
