import { GraphQLClient } from 'graphql-request';

import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { YieldSource } from '../../aws/models/yield-source.model';
import { getSdk as getUniswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/uniswap';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { createYieldSource } from '../../vaults/vaults.utils';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { UniPairDayData } from '../interfaces/uni-pair-day-data.interface';

export async function getUniV2SwapValue(graphUrl: string, vault: VaultDefinitionModel): Promise<YieldSource> {
  const client = new GraphQLClient(graphUrl);
  const sdk = getUniswapSdk(client);
  const { pairDayDatas } = await sdk.UniPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pairAddress: vault.depositToken.toLowerCase(),
    },
  });
  return getUniSwapValue(vault, pairDayDatas);
}

async function getUniSwapValue(vault: VaultDefinitionModel, tradeData: UniPairDayData[]): Promise<YieldSource> {
  const name = `${vault.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return createYieldSource(vault.address, SourceType.TradeFee, name, 0);
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
  return createYieldSource(vault.address, SourceType.TradeFee, name, currentApy);
}

export function getSwapValue(vault: VaultDefinitionModel, tradeData: PairDayData[]): YieldSource {
  const name = `${vault.protocol} LP Fees`;
  if (!tradeData || tradeData.length === 0) {
    return createYieldSource(vault.address, SourceType.TradeFee, name, 0);
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
  return createYieldSource(vault.address, SourceType.TradeFee, name, currentApy);
}
