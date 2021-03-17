import { formatEther } from '@ethersproject/units';
import { Inject, Service } from '@tsed/di';
import { BigNumber, ethers } from 'ethers';
import { CacheService } from '../../cache/CacheService';
import { erc20Abi, pancakeChefAbi } from '../../config/abi';
import { Chain } from '../../config/chain/chain';
import { BLOCKS_PER_YEAR, PANCAKE_CHEF, PANCAKESWAP_URL, TOKENS } from '../../config/constants';
import { PoolInfo } from '../../interface/MasterChef';
import { combinePerformance, Performance, uniformPerformance } from '../../interface/Performance';
import { SettDefinition } from '../../interface/Sett';
import { getTokenPriceData } from '../../prices/prices-util';
import { PricesService } from '../../prices/PricesService';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { SwapService } from '../common/SwapService';

@Service()
export class PancakeSwapService extends SwapService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  constructor() {
    super(PANCAKESWAP_URL);
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<Performance> {
    const { depositToken } = sett;
    const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
    const cachedPool = this.cacheService.get<Performance>(cacheKey);
    if (cachedPool) {
      return cachedPool;
    }
    const [tradeFeePerformance, poolApr] = await Promise.all([
      this.getSwapPerformance(depositToken),
      this.getPoolApr(chain, sett.depositToken, 15),
    ]);
    return combinePerformance(tradeFeePerformance, poolApr);
  }

  async getPoolApr(chain: Chain, contract: string, poolId: number): Promise<Performance> {
    const cacheKey = CacheService.getCacheKey(chain.name, contract, poolId.toString());
    const cachedPool = this.cacheService.get<Performance>(cacheKey);
    if (cachedPool) {
      return cachedPool;
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
    const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * BLOCKS_PER_YEAR * tokenPrice.usd;
    const poolApr = uniformPerformance((cakeEmission / poolValue) * 100);
    this.cacheService.set(cacheKey, poolApr);
    return poolApr;
  }
}
