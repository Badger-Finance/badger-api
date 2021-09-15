import { UnprocessableEntity } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../../chains/config/chain.config';
import { ChainNetwork } from '../../chains/enums/chain-network.enum';
import {
  ONE_YEAR_SECONDS,
  SUSHISWAP_ARBITRUM_URL,
  SUSHISWAP_MATIC_URL,
  SUSHISWAP_URL,
  SUSHISWAP_XDAI_URL,
} from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { Erc20__factory, SushiChef__factory, SushiMiniChef__factory } from '../../contracts';
import { getSdk as getSushiswapSdk, OrderDirection, PairDayData_OrderBy } from '../../graphql/generated/sushiswap';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { noRewards } from '../../rewards/rewards.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { PairDayData } from '../interfaces/pair-day-data.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';
import { getSwapValue } from './strategy.utils';

const SUSHI_MATIC_CHEF = '0x0769fd68dFb93167989C6f7254cd0D766Fb2841F';
const SUSHI_ARB_CHEF = '0xF4d73326C13a4Fc5FD7A064217e12780e9Bd62c3';
const SUSHI_CHEF = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';

const sushiPoolId: PoolMap = {
  [TOKENS.SUSHI_IBBTC_WBTC]: 235,
  [TOKENS.SUSHI_ETH_WBTC]: 21,
  [TOKENS.SUSHI_BADGER_WBTC]: 73,
  [TOKENS.SUSHI_DIGG_WBTC]: 103,
  [TOKENS.MATIC_SUSHI_IBBTC_WBTC]: 24,
  [TOKENS.ARB_SUSHI_WETH_SUSHI]: 2,
  [TOKENS.ARB_SUSHI_WETH_WBTC]: 3,
};

const sushiSellRate: Record<string, number> = {
  [ChainNetwork.Ethereum]: 0,
  [ChainNetwork.Matic]: 0,
  [ChainNetwork.Arbitrum]: 0.5,
};

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
    case ChainNetwork.Matic:
      graphUrl = SUSHISWAP_MATIC_URL;
      break;
    case ChainNetwork.Arbitrum:
      graphUrl = SUSHISWAP_ARBITRUM_URL;
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
  const rewardType = chain.network === ChainNetwork.Ethereum ? 'xSushi' : 'Sushi';
  const sourceName = `${rewardType} Rewards`;
  let emissionSource = valueSourceToCachedValueSource(
    createValueSource(sourceName, uniformPerformance(0)),
    settDefinition,
    SourceType.Emission,
  );

  switch (chain.network) {
    case ChainNetwork.Matic:
      emissionSource = await getPerSecondSource(chain, settDefinition);
      break;
    case ChainNetwork.Arbitrum:
      emissionSource = await getArbitrumSource(chain, settDefinition);
      break;
    case ChainNetwork.Ethereum:
    default:
      emissionSource = await getEthereumSource(chain, settDefinition);
  }

  return emissionSource;
}

async function getEthereumSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const poolId = sushiPoolId[settDefinition.depositToken];
  if (!poolId || !settDefinition.strategy) {
    return valueSourceToCachedValueSource(
      createValueSource('xSushi Rewards', uniformPerformance(0)),
      settDefinition,
      SourceType.Emission,
    );
  }
  const sellRate = 1 - sushiSellRate[chain.network];
  const depositToken = Erc20__factory.connect(settDefinition.depositToken, chain.provider);
  const sushiChef = SushiChef__factory.connect(SUSHI_CHEF, chain.provider);
  const [depositTokenPrice, sushiPrice, sushiPerBlock, totalAllocPoint, poolInfo, userInfo, poolBalance] =
    await Promise.all([
      getPrice(settDefinition.depositToken),
      getPrice(TOKENS.SUSHI),
      sushiChef.sushiPerBlock(),
      sushiChef.totalAllocPoint(),
      sushiChef.poolInfo(poolId),
      sushiChef.userInfo(poolId, settDefinition.strategy),
      depositToken.balanceOf(SUSHI_CHEF),
    ]);

  let sushiApr = 0;
  if (userInfo.amount.gt(0)) {
    const poolValue = formatBalance(poolBalance) * depositTokenPrice.usd;
    const emissionScalar = poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber();
    const sushiEmission = formatBalance(sushiPerBlock) * emissionScalar * chain.blocksPerYear * sushiPrice.usd;
    sushiApr = (sushiEmission / poolValue) * 100 * sellRate;
  }

  return valueSourceToCachedValueSource(
    createValueSource('xSushi Rewards', uniformPerformance(sushiApr)),
    settDefinition,
    SourceType.Emission,
  );
}

async function getPerSecondSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const poolId = sushiPoolId[settDefinition.depositToken];
  if (!poolId || !settDefinition.strategy) {
    return valueSourceToCachedValueSource(
      createValueSource('Sushi Rewards', uniformPerformance(0)),
      settDefinition,
      SourceType.Emission,
    );
  }
  let chef;
  switch (chain.network) {
    case ChainNetwork.Matic:
      chef = SUSHI_MATIC_CHEF;
      break;
    case ChainNetwork.Arbitrum:
      chef = SUSHI_ARB_CHEF;
      break;
    default:
      throw new UnprocessableEntity(`Sushiswap does not support ${chain.network}`);
  }
  const sellRate = 1 - sushiSellRate[chain.network];
  const depositToken = Erc20__factory.connect(settDefinition.depositToken, chain.provider);
  const miniChef = SushiMiniChef__factory.connect(chef, chain.provider);
  const [depositTokenPrice, sushiPrice, sushiPerSecond, totalAllocPoint, poolInfo, userInfo, poolBalance] =
    await Promise.all([
      getPrice(settDefinition.depositToken),
      getPrice(TOKENS.SUSHI),
      miniChef.sushiPerSecond(),
      miniChef.totalAllocPoint(),
      miniChef.poolInfo(poolId),
      miniChef.userInfo(poolId, settDefinition.strategy),
      depositToken.balanceOf(chef),
    ]);

  let sushiApr = 0;
  if (userInfo.amount.gt(0)) {
    const poolValue = formatBalance(poolBalance) * depositTokenPrice.usd;
    const emissionScalar = poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber();
    const sushiEmission = formatBalance(sushiPerSecond) * emissionScalar * ONE_YEAR_SECONDS * sushiPrice.usd;
    sushiApr = (sushiEmission / poolValue) * 100 * sellRate;
  }

  return valueSourceToCachedValueSource(
    createValueSource('Sushi Rewards', uniformPerformance(sushiApr)),
    settDefinition,
    SourceType.Emission,
  );
}

async function getArbitrumSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const sushi = getToken(TOKENS.SUSHI);
  if (settDefinition.depositToken === TOKENS.ARB_SUSHI_WETH_SUSHI) {
    return noRewards(settDefinition, sushi);
  }
  let source = await getPerSecondSource(chain, settDefinition);
  if (settDefinition.depositToken === TOKENS.ARB_SUSHI_WETH_WBTC) {
    const helperVault = getToken(TOKENS.BARB_SUSHI_WETH_SUSHI);
    source = valueSourceToCachedValueSource(
      createValueSource(`${helperVault.symbol} Rewards`, uniformPerformance(source.apr * 0.5)),
      settDefinition,
      tokenEmission(helperVault),
    );
  }
  return source;
}
