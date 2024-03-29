import { Network } from '@badger-dao/sdk';
import { GraphQLClient } from 'graphql-request';

import { CachedYieldSource } from '../../aws/models/cached-yield-source.interface';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { Chain } from '../../chains/config/chain.config';
import { SUSHISWAP_ARBITRUM_URL, SUSHISWAP_MATIC_URL, SUSHISWAP_URL } from '../../config/constants';
import { getSdk as getSushiswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/sushiswap';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { Nullable } from '../../utils/types.utils';
import { createYieldSource } from '../../vaults/yields.utils';
import { PairDayData } from '../interfaces/pair-day-data.interface';

/**
 * Load sushiswap non-emitted yield sources.
 * @param chain network vault is deployed
 * @param vaultDefinition requested vault
 * @returns yield sources vault earns that are not harvested
 */
export async function getSushiswapYieldSources(
  chain: Chain,
  vaultDefinition: VaultDefinitionModel,
): Promise<CachedYieldSource[]> {
  let graphUrl;
  switch (chain.network) {
    case Network.Polygon:
      graphUrl = SUSHISWAP_MATIC_URL;
      break;
    case Network.Arbitrum:
      graphUrl = SUSHISWAP_ARBITRUM_URL;
      break;
    default:
      graphUrl = SUSHISWAP_URL;
  }
  const result = await getSushiSwapValue(vaultDefinition, graphUrl);
  if (result) {
    return [result];
  }
  return [];
}

async function getSushiSwapValue(
  vaultDefinition: VaultDefinitionModel,
  graphUrl: string,
): Promise<Nullable<CachedYieldSource>> {
  const client = new GraphQLClient(graphUrl);
  const sdk = getSushiswapSdk(client);
  const { pairDayDatas } = await sdk.SushiPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pair: vaultDefinition.depositToken.toLowerCase(),
    },
  });
  const tradeData = pairDayDatas.map((d): PairDayData => ({ reserveUSD: d.reserveUSD, dailyVolumeUSD: d.volumeUSD }));
  if (!tradeData || tradeData.length === 0) {
    return null;
  }
  let totalApr = 0;
  for (let i = 0; i < tradeData.length; i++) {
    const volume = Number(tradeData[i].dailyVolumeUSD);
    const poolReserve = Number(tradeData[i].reserveUSD);
    const fees = volume * 0.0025;
    totalApr += (fees / poolReserve) * 365 * 100;
  }
  const averageApr = totalApr / tradeData.length;
  return createYieldSource(vaultDefinition, SourceType.TradeFee, `${vaultDefinition.protocol} LP Fees`, averageApr);
}
