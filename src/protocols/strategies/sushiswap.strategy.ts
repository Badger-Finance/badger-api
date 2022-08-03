import { Network } from '@badger-dao/sdk';
import { GraphQLClient } from 'graphql-request';

import { CachedValueSource } from '../../aws/models/apy-snapshots.model';
import { VaultDefinitionModel } from '../../aws/models/vault-definition.model';
import { Chain } from '../../chains/config/chain.config';
import { SUSHISWAP_ARBITRUM_URL, SUSHISWAP_MATIC_URL, SUSHISWAP_URL } from '../../config/constants';
import { getSdk as getSushiswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/sushiswap';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { getSwapValue } from './strategy.utils';

export class SushiswapStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<CachedValueSource[]> {
    return Promise.all([getSushiswapSwapValue(chain, vaultDefinition)]);
  }
}

async function getSushiswapSwapValue(chain: Chain, vaultDefinition: VaultDefinitionModel): Promise<CachedValueSource> {
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
  return getSushiSwapValue(vaultDefinition, graphUrl);
}

export async function getSushiSwapValue(
  vaultDefinition: VaultDefinitionModel,
  graphUrl: string,
): Promise<CachedValueSource> {
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
  const converted = pairDayDatas.map((d): PairDayData => ({ reserveUSD: d.reserveUSD, dailyVolumeUSD: d.volumeUSD }));
  return getSwapValue(vaultDefinition, converted);
}
