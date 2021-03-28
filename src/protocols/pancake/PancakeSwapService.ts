import { formatEther } from '@ethersproject/units';
import { Inject, Service } from '@tsed/di';
import { BigNumber, ethers } from 'ethers';
import { CacheService } from '../../cache/CacheService';
import { Chain } from '../../chains/config/chain.config';
import { erc20Abi, pancakeChefAbi } from '../../config/abi';
import { BSC_BLOCKS_PER_YEAR, PANCAKE_CHEF, PANCAKESWAP_URL, TOKENS } from '../../config/constants';
import { PoolInfo } from '../../interface/MasterChef';
import { SettDefinition } from '../../interface/Sett';
import { getTokenPriceData } from '../../prices/prices-util';
import { PricesService } from '../../prices/PricesService';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { SwapService } from '../common/SwapService';
import { uniformPerformance } from '../interfaces/performance.interface';
import { ValueSource } from '../interfaces/value-source.interface';

@Service()
export class PancakeSwapService extends SwapService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  constructor() {
    super(PANCAKESWAP_URL, 'Pancakeswap');
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    const { depositToken } = sett;
    const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
    const cachedValueSource = this.cacheService.get<ValueSource[]>(cacheKey);
    if (cachedValueSource) {
      return cachedValueSource;
    }
    const [tradeFeePerformance, poolApr] = await Promise.all([
      this.getSwapPerformance(depositToken),
      this.getPoolApr(chain, sett.depositToken, getPoolId(sett.depositToken)),
    ]);
    return [tradeFeePerformance, poolApr];
  }

  async getPoolApr(chain: Chain, contract: string, poolId: number): Promise<ValueSource> {
    const emissionSource: ValueSource = {
      name: 'Cake',
      apy: 0,
      performance: uniformPerformance(0),
    };
    if (!poolId) {
      return emissionSource;
    }
    const cacheKey = CacheService.getCacheKey(chain.name, contract, poolId.toString());
    const cachedValueSource = this.cacheService.get<ValueSource>(cacheKey);
    if (cachedValueSource) {
      return cachedValueSource;
    }
    const masterChef = new ethers.Contract(PANCAKE_CHEF, pancakeChefAbi, chain.provider);
    const [totalAllocPoint, cakePerBlock, poolInfo, tokenPrice]: [
      BigNumber,
      BigNumber,
      PoolInfo,
      TokenPrice,
    ] = await Promise.all([
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
    const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * BSC_BLOCKS_PER_YEAR * tokenPrice.usd;
    emissionSource.performance = uniformPerformance((cakeEmission / poolValue) * 100);
    emissionSource.apy = emissionSource.performance.threeDay;
    emissionSource.harvestable = true;
    this.cacheService.set(cacheKey, emissionSource);
    return emissionSource;
  }
}

// TODO: Remove this once pancakeswap masterchef subgraph has synced
const getPoolId = (depositToken: string): number => {
  const poolMap: Record<string, number> = {};
  poolMap[TOKENS.PANCAKE_BNB_BTCB] = 15;
  poolMap[TOKENS.PANCAKE_BBADGER_BTCB] = 106;
  poolMap[TOKENS.PANCAKE_BDIGG_BTCB] = 104;
  return poolMap[depositToken];
};
