import { formatEther } from '@ethersproject/units';
import { Chain } from '../../chains/config/chain.config';
import { PANCAKE_CHEF } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { Erc20__factory, PancakeChef__factory } from '../../contracts';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getTokenPriceData } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { VAULT_SOURCE } from '../../setts/setts.utils';
import { formatBalance } from '../../tokens/tokens.utils';
import { SourceType } from '../enums/source-type.enum';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource } from '../interfaces/value-source.interface';

export class PancakeswapStrategy {
  static async getValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getEmissionSource(chain, settDefinition)]);
  }
}

async function getEmissionSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const poolId = getPoolId(settDefinition.depositToken);
  const masterChef = PancakeChef__factory.connect(PANCAKE_CHEF, chain.provider);
  const [_totalAllocPoint, cakePerBlock, poolInfo, tokenPrice] = await Promise.all([
    masterChef.totalAllocPoint(),
    masterChef.cakePerBlock(),
    masterChef.poolInfo(poolId),
    getTokenPriceData(TOKENS.CAKE),
  ]);
  const depositToken = Erc20__factory.connect(poolInfo.lpToken, chain.provider);
  const poolBalance = formatBalance(await depositToken.balanceOf(PANCAKE_CHEF));
  const depositTokenValue = await getTokenPriceData(poolInfo.lpToken);
  const poolValue = poolBalance * depositTokenValue.usd;
  // const emissionScalar = poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber();
  const emissionScalar = 1;
  const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * chain.blocksPerYear * tokenPrice.usd;
  const emissionSource = createValueSource(VAULT_SOURCE, uniformPerformance((cakeEmission / poolValue) * 100), true);
  return valueSourceToCachedValueSource(emissionSource, settDefinition, SourceType.Compound);
}

function getPoolId(depositToken: string): number {
  const poolMap: PoolMap = {};
  poolMap[TOKENS.PANCAKE_BNB_BTCB] = 262;
  poolMap[TOKENS.PANCAKE_BBADGER_BTCB] = 332;
  poolMap[TOKENS.PANCAKE_BDIGG_BTCB] = 331;
  return poolMap[depositToken];
}
