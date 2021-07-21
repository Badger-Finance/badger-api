import { formatEther } from '@ethersproject/units';
import { BigNumber, ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { erc20Abi } from '../../config/abi/erc20.abi';
import { pancakeChefAbi } from '../../config/abi/pancake-chec.abi';
import { PANCAKE_CHEF } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getTokenPriceData } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { VAULT_SOURCE } from '../../setts/setts.utils';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { SourceType } from '../enums/source-type.enum';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolInfo } from '../interfaces/pool-info.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource } from '../interfaces/value-source.interface';

export class PancakeswapStrategy {
  static async getValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getEmissionSource(chain, settDefinition)]);
  }
}

async function getEmissionSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  const poolId = getPoolId(settDefinition.depositToken);
  const masterChef = new ethers.Contract(PANCAKE_CHEF, pancakeChefAbi, chain.provider);
  const [totalAllocPoint, cakePerBlock, poolInfo, tokenPrice]: [BigNumber, BigNumber, PoolInfo, TokenPrice] =
    await Promise.all([
      masterChef.totalAllocPoint(),
      masterChef.cakePerBlock(),
      masterChef.poolInfo(poolId),
      getTokenPriceData(TOKENS.CAKE),
    ]);
  const depositToken = new ethers.Contract(poolInfo.lpToken, erc20Abi, chain.provider);
  const poolBalance = (await depositToken.balanceOf(PANCAKE_CHEF)) / 1e18;
  const depositTokenValue = await getTokenPriceData(poolInfo.lpToken);
  const poolValue = poolBalance * depositTokenValue.usd;
  const emissionScalar = poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber();
  const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * chain.blocksPerYear * tokenPrice.usd;
  const emissionSource = createValueSource(VAULT_SOURCE, uniformPerformance((cakeEmission / poolValue) * 100), true);
  return valueSourceToCachedValueSource(emissionSource, settDefinition, SourceType.Emission);
}

function getPoolId(depositToken: string): number {
  const poolMap: PoolMap = {};
  poolMap[TOKENS.PANCAKE_BNB_BTCB] = 262;
  poolMap[TOKENS.PANCAKE_BBADGER_BTCB] = 332;
  poolMap[TOKENS.PANCAKE_BDIGG_BTCB] = 331;
  return poolMap[depositToken];
}
