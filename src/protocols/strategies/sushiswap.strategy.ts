import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
// import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import { masterChefAbi } from '../../config/abi/sushi-chef.abi';
import { MASTERCHEF_URL, SUSHI_CHEF, SUSHISWAP_URL, SUSHISWAP_XDAI_URL } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { getSdk, OrderDirection, Pool_OrderBy } from '../../graphql/generated/master-chef';
import { getSdk as getSushiswapSdk, PairDayData_OrderBy } from '../../graphql/generated/sushiswap';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { SourceType } from '../enums/source-type.enum';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { UserInfo } from '../interfaces/user-info.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { getSwapValue } from './strategy.utils';
// import { xSushiApr } from '../interfaces/xsushi-apr.interface';
// import { getSdk as getSushiswapSdk } from '../../graphql/generated/sushiswap';

export class SushiswapStrategy {
  static async getValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getSushiSwapValue(chain, settDefinition), getEmissionSource(chain, settDefinition)]);
  }
}

async function getSushiSwapValue(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  let graphUrl;
  switch (chain.network) {
    case ChainNetwork.xDai:
      graphUrl = SUSHISWAP_XDAI_URL;
      break;
    default:
      graphUrl = SUSHISWAP_URL;
  }

  const client = new GraphQLClient(graphUrl);
  const sdk = getSushiswapSdk(client);
  const { pairDayDatas } = await sdk.SushiPairDayDatas({
    first: 30,
    orderBy: PairDayData_OrderBy.Date,
    orderDirection: OrderDirection.Desc,
    where: {
      pair: settDefinition.depositToken.toLowerCase(),
    },
  });
  const converted = pairDayDatas.map((d): PairDayData => ({ reserveUSD: d.reserveUSD, dailyVolumeUSD: d.volumeUSD }));
  return getSwapValue(settDefinition, converted);
}

async function getEmissionSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const masterChefDaoGraphqlClient = new GraphQLClient(MASTERCHEF_URL);
  const masterChefGraphqlSdk = getSdk(masterChefDaoGraphqlClient);
  const masterChefData = await masterChefGraphqlSdk.MasterChefsAndPools({
    first: 1,
    orderBy: Pool_OrderBy.AllocPoint,
    orderDirection: OrderDirection.Desc,
    where: { allocPoint_gt: 0 },
  });
  const { depositToken } = settDefinition;
  const masterChef = masterChefData.masterChefs[0];
  const pool = masterChefData.pools.find((p) => p.pair === depositToken.toLowerCase());
  if (!pool || !settDefinition.strategy) {
    return valueSourceToCachedValueSource(
      createValueSource('xSushi Rewards', uniformPerformance(0)),
      settDefinition,
      SourceType.Emission,
    );
  }
  const sushiChef = new ethers.Contract(SUSHI_CHEF, masterChefAbi, chain.provider);
  const [depositTokenPrice, sushiPrice] = await Promise.all([getPrice(pool.pair), getPrice(TOKENS.SUSHI)]);
  const totalAllocPoint = masterChef.totalAllocPoint;
  const strategyInfo: UserInfo = await sushiChef.userInfo(pool.id, settDefinition.strategy);

  let sushiApr = 0;
  if (strategyInfo.amount.gt(0)) {
    // const xSushiResponse = await fetch(SushiswapService.xSushiAprEndpoint);
    // let xSushiAprMultiplier = 1;
    // if (xSushiResponse.ok) {
    //   const xSushiApr: xSushiApr = await xSushiResponse.json();
    //   xSushiAprMultiplier += parseFloat(xSushiApr.APR) / 100;
    // }
    const poolValue = pool.balance * depositTokenPrice.usd;
    const emissionScalar = pool.allocPoint / totalAllocPoint;
    const sushiEmission = masterChef.sushiPerBlock * emissionScalar * chain.blocksPerYear * sushiPrice.usd;
    // sushiApr = (sushiEmission / poolValue) * 100 * xSushiAprMultiplier;
    sushiApr = (sushiEmission / poolValue) * 100;
  }
  return valueSourceToCachedValueSource(
    createValueSource('xSushi Rewards', uniformPerformance(sushiApr)),
    settDefinition,
    SourceType.Emission,
  );
}
