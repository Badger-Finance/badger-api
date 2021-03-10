import { Inject, Service } from '@tsed/di';
import { ethers } from 'ethers';
import { CacheService } from '../../cache/CacheService';
import { erc20Abi, masterChefAbi } from '../../config/abi';
import { Chain } from '../../config/chain';
import { BLOCKS_PER_YEAR, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import { getMasterChef, getSushiswapPrice, MasterChefData } from '../../config/util';
import { PoolInfo } from '../../interface/MasterChef';
import { combinePerformance, Performance, uniformPerformance } from '../../interface/Performance';
import { SettDefinition } from '../../interface/Sett';
import { PriceService } from '../../prices/PricesService';
import { TokensService } from '../../tokens/TokensService';
import { SwapService } from '../common/SwapService';

@Service()
export class SushiswapService extends SwapService {
	@Inject()
	tokensService!: TokensService;
	@Inject()
	priceService!: PriceService;
	@Inject()
	cacheService!: CacheService;

	constructor() {
		super(SUSHISWAP_URL);
	}

	async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<Performance> {
		const { depositToken } = sett;
		const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
		const cachedPool = this.cacheService.get(cacheKey);
		if (cachedPool) {
			return cachedPool as Performance;
		}
		const [tradeFeePerformance, poolId] = await Promise.all([
			this.getSwapPerformance(depositToken),
			this.getPoolId(depositToken),
		]);
		if (!poolId) {
			this.cacheService.set(cacheKey, tradeFeePerformance);
			return tradeFeePerformance;
		}
		const emissionPerformance = await this.getPoolApr(chain, poolId);
		const combinedPerformance = combinePerformance(tradeFeePerformance, emissionPerformance);
		this.cacheService.set(cacheKey, combinedPerformance);
		return combinedPerformance;
	}

	async getPoolApr(chain: Chain, poolId: number): Promise<Performance> {
		const masterChef = new ethers.Contract(SUSHI_CHEF, masterChefAbi, chain.provider);
		const [totalAllocPoint, sushiPerBlock, poolInfo, tokenPrice] = await Promise.all([
			masterChef.totalAllocPoint() as number,
			masterChef.sushiPerBlock() as number,
			masterChef.poolInfo(poolId) as PoolInfo,
			this.priceService.getTokenPriceData(TOKENS.SUSHI),
		]);
		const depositToken = new ethers.Contract(poolInfo.lpToken, erc20Abi, chain.provider);
		const poolBalance = (await depositToken.balanceOf(SUSHI_CHEF)) / 1e18;
		const depositTokenValue = await getSushiswapPrice(poolInfo.lpToken);
		const poolValue = poolBalance * depositTokenValue.usd;
		const emissionScalar = poolInfo.allocPoint / totalAllocPoint;
		const sushiEmission = (sushiPerBlock / 1e18) * emissionScalar * BLOCKS_PER_YEAR * tokenPrice.usd;
		const poolApr = (sushiEmission / poolValue) * 100;
		return uniformPerformance(poolApr);
	}

	async getPoolId(depositToken: string): Promise<number | undefined> {
		let masterChefData: MasterChefData | undefined = this.cacheService.get(SUSHI_CHEF);
		if (!masterChefData) {
			masterChefData = await getMasterChef();
			this.cacheService.set(SUSHI_CHEF, masterChefData);
		}
		const masterChefPools = masterChefData.data.pools;
		const sushiPool = masterChefPools.find((pool) => depositToken.toLowerCase() === pool.pair);
		if (sushiPool) {
			return parseInt(sushiPool.id);
		}
		return sushiPool;
	}
}
