import { GraphQLClient } from 'graphql-request';
import { getSdk as getUniswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/uniswap';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { valueSourceToCachedValueSource } from '../../rewards/rewards.utils';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { UniPairDayData } from '../interfaces/uni-pair-day-data.interface';
import { createValueSource } from '../interfaces/value-source.interface';

export async function getUniV2SwapValue(
  graphUrl: string,
  VaultDefinition: VaultDefinition,
): Promise<CachedValueSource> {
  const client = new GraphQLClient(graphUrl);
  const sdk = getUniswapSdk(client);
  const { pairDayDatas } = await sdk.UniPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pairAddress: VaultDefinition.depositToken.toLowerCase(),
    },
  });
  return getUniSwapValue(VaultDefinition, pairDayDatas);
}

async function getUniSwapValue(
  VaultDefinition: VaultDefinition,
  tradeData: UniPairDayData[],
): Promise<CachedValueSource> {
  const name = `${VaultDefinition.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return valueSourceToCachedValueSource(createValueSource(name, 0), VaultDefinition, SourceType.TradeFee);
  }
  const [token0Price, token1Price] = await Promise.all([
    getPrice(tradeData[0].token0.id),
    getPrice(tradeData[0].token1.id),
  ]);
  let totalApy = 0;
  let currentApy = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const token0Volume = Number(tradeData[i].dailyVolumeToken0) * token0Price.price;
    const token1Volume = Number(tradeData[i].dailyVolumeToken1) * token1Price.price;
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = (token0Volume + token1Volume) * 0.003;
    totalApy += (fees / poolReserve) * 365 * 100;
    currentApy = totalApy / (i + 1);
  }
  return valueSourceToCachedValueSource(createValueSource(name, currentApy), VaultDefinition, SourceType.TradeFee);
}

export function getSwapValue(VaultDefinition: VaultDefinition, tradeData: PairDayData[]): CachedValueSource {
  const name = `${VaultDefinition.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return valueSourceToCachedValueSource(createValueSource(name, 0), VaultDefinition, SourceType.TradeFee);
  }
  let totalApy = 0;
  let currentApy = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const volume = Number(tradeData[i].dailyVolumeUSD);
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = volume * 0.0025;
    totalApy += (fees / poolReserve) * 365 * 100;
    currentApy = totalApy / (i + 1);
  }
  return valueSourceToCachedValueSource(createValueSource(name, currentApy), VaultDefinition, SourceType.TradeFee);
}
