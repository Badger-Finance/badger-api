import { GraphQLClient } from 'graphql-request';
import { getSdk as getUniswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/uniswap';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource } from '../interfaces/value-source.interface';

export async function getUniV2SwapValue(graphUrl: string, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const client = new GraphQLClient(graphUrl);
  const sdk = getUniswapSdk(client);
  const { pairDayDatas } = await sdk.UniPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pairAddress: settDefinition.depositToken.toLowerCase(),
    },
  });
  return getSwapValue(settDefinition, pairDayDatas);
}

export async function getSwapValue(
  settDefinition: SettDefinition,
  tradeData: PairDayData[],
): Promise<CachedValueSource> {
  const name = `${settDefinition.protocol} LP Fees`;
  const performance = uniformPerformance(0);
  if (!tradeData || tradeData.length === 0) {
    return valueSourceToCachedValueSource(createValueSource(name, performance), settDefinition, SourceType.TradeFee);
  }
  let totalApy = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const volume = Number(tradeData[i].dailyVolumeUSD);
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = volume * 0.003;
    totalApy += (fees / poolReserve) * 365 * 100;
    const currentApy = totalApy / (i + 1);
    if (i === 0) performance.oneDay = currentApy;
    if (i === 2) performance.threeDay = currentApy;
    if (i === 6) performance.sevenDay = currentApy;
    if (i === 29) performance.thirtyDay = currentApy;
  }
  return valueSourceToCachedValueSource(createValueSource(name, performance), settDefinition, SourceType.TradeFee);
}
