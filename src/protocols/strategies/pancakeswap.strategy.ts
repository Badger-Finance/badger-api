import { formatEther } from '@ethersproject/units';
import { Chain } from '../../chains/config/chain.config';
import { PANCAKE_CHEF } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { Erc20__factory, PancakeChef__factory } from '../../contracts';
import { valueSourceToCachedValueSource } from '../../indexers/indexer.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { VAULT_SOURCE } from '../../vaults/vaults.utils';
import { formatBalance } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { getPrice } from '../../prices/prices.utils';

export class PancakeswapStrategy {
  static async getValueSources(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    return Promise.all([getEmissionSource(chain, VaultDefinition)]);
  }
}

async function getEmissionSource(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  const poolId = getPoolId(VaultDefinition.depositToken);
  const masterChef = PancakeChef__factory.connect(PANCAKE_CHEF, chain.provider);
  const [totalAllocPoint, cakePerBlock, poolInfo, tokenPrice] = await Promise.all([
    masterChef.totalAllocPoint(),
    masterChef.cakePerBlock(),
    masterChef.poolInfo(poolId),
    getPrice(TOKENS.CAKE),
  ]);
  const depositToken = Erc20__factory.connect(poolInfo.lpToken, chain.provider);
  const poolBalance = formatBalance(await depositToken.balanceOf(PANCAKE_CHEF));
  const depositTokenValue = await getPrice(poolInfo.lpToken);
  const poolValue = poolBalance * depositTokenValue.usd;
  const emissionScalar = poolInfo.allocPoint.toNumber() / totalAllocPoint.toNumber();
  const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * chain.blocksPerYear * tokenPrice.usd;
  const emissionSource = createValueSource(VAULT_SOURCE, uniformPerformance((cakeEmission / poolValue) * 100), true);
  return valueSourceToCachedValueSource(emissionSource, VaultDefinition, SourceType.Compound);
}

function getPoolId(depositToken: string): number {
  const poolMap: PoolMap = {};
  poolMap[TOKENS.PANCAKE_BNB_BTCB] = 262;
  poolMap[TOKENS.PANCAKE_BBADGER_BTCB] = 332;
  poolMap[TOKENS.PANCAKE_BDIGG_BTCB] = 331;
  return poolMap[depositToken];
}
