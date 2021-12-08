import { Network } from '@badger-dao/sdk';
import { UnprocessableEntity } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../../chains/config/chain.config';
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
import { valueSourceToCachedValueSource } from '../../indexers/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { noRewards } from '../../rewards/rewards.utils';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
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
  [Network.Ethereum]: 0,
  [Network.Polygon]: 0,
  [Network.Arbitrum]: 0.5,
};

export class SushiswapStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getSushiswapSwapValue(chain, vaultDefinition), getEmissionSource(chain, vaultDefinition)]);
  }
}

async function getSushiswapSwapValue(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  let graphUrl;
  switch (chain.network) {
    case Network.xDai:
      graphUrl = SUSHISWAP_XDAI_URL;
      break;
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
  vaultDefinition: VaultDefinition,
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

async function getEmissionSource(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const rewardType = chain.network === Network.Ethereum ? 'xSushi' : 'Sushi';
  const sourceName = `${rewardType} Rewards`;
  let emissionSource = valueSourceToCachedValueSource(
    createValueSource(sourceName, uniformPerformance(0)),
    vaultDefinition,
    SourceType.Emission,
  );

  switch (chain.network) {
    case Network.Polygon:
      emissionSource = await getPerSecondSource(chain, vaultDefinition);
      break;
    case Network.Arbitrum:
      emissionSource = await getArbitrumSource(chain, vaultDefinition);
      break;
    case Network.Ethereum:
    default:
      emissionSource = await getEthereumSource(chain, vaultDefinition);
  }

  return emissionSource;
}

async function getEthereumSource(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const poolId = sushiPoolId[vaultDefinition.depositToken];
  if (!poolId || !vaultDefinition.strategy) {
    return valueSourceToCachedValueSource(
      createValueSource('xSushi Rewards', uniformPerformance(0)),
      vaultDefinition,
      SourceType.Emission,
    );
  }
  const sellRate = 1 - sushiSellRate[chain.network];
  const depositToken = Erc20__factory.connect(vaultDefinition.depositToken, chain.provider);
  const sushiChef = SushiChef__factory.connect(SUSHI_CHEF, chain.provider);
  const [depositTokenPrice, sushiPrice, sushiPerBlock, totalAllocPoint, poolInfo, userInfo, poolBalance] =
    await Promise.all([
      getPrice(vaultDefinition.depositToken),
      getPrice(TOKENS.SUSHI),
      sushiChef.sushiPerBlock(),
      sushiChef.totalAllocPoint(),
      sushiChef.poolInfo(poolId),
      sushiChef.userInfo(poolId, vaultDefinition.strategy),
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
    vaultDefinition,
    SourceType.Emission,
  );
}

async function getPerSecondSource(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const poolId = sushiPoolId[vaultDefinition.depositToken];
  if (!poolId || !vaultDefinition.strategy) {
    return valueSourceToCachedValueSource(
      createValueSource('Sushi Rewards', uniformPerformance(0)),
      vaultDefinition,
      SourceType.Emission,
    );
  }
  let chef;
  switch (chain.network) {
    case Network.Polygon:
      chef = SUSHI_MATIC_CHEF;
      break;
    case Network.Arbitrum:
      chef = SUSHI_ARB_CHEF;
      break;
    default:
      throw new UnprocessableEntity(`Sushiswap does not support ${chain.network}`);
  }
  const sellRate = 1 - sushiSellRate[chain.network];
  const depositToken = Erc20__factory.connect(vaultDefinition.depositToken, chain.provider);
  const miniChef = SushiMiniChef__factory.connect(chef, chain.provider);
  const [depositTokenPrice, sushiPrice, sushiPerSecond, totalAllocPoint, poolInfo, userInfo, poolBalance] =
    await Promise.all([
      getPrice(vaultDefinition.depositToken),
      getPrice(TOKENS.SUSHI),
      miniChef.sushiPerSecond(),
      miniChef.totalAllocPoint(),
      miniChef.poolInfo(poolId),
      miniChef.userInfo(poolId, vaultDefinition.strategy),
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
    vaultDefinition,
    SourceType.Emission,
  );
}

async function getArbitrumSource(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const sushi = getToken(TOKENS.SUSHI);
  if (vaultDefinition.depositToken === TOKENS.ARB_SUSHI_WETH_SUSHI) {
    return noRewards(vaultDefinition, sushi);
  }
  let source = await getPerSecondSource(chain, vaultDefinition);
  if (vaultDefinition.depositToken === TOKENS.ARB_SUSHI_WETH_WBTC) {
    const helperVault = getToken(TOKENS.BARB_SUSHI_WETH_SUSHI);
    source = valueSourceToCachedValueSource(
      createValueSource(`${helperVault.symbol} Rewards`, uniformPerformance(source.apr * 0.5)),
      vaultDefinition,
      tokenEmission(helperVault),
    );
  }
  return source;
}
