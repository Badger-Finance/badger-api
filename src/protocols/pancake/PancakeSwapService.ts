import { Inject, Service } from '@tsed/di';
import { ethers } from 'ethers';
import NodeCache from 'node-cache';
import { erc20Abi, pancakeChefAbi } from '../../config/abi';
import { Chain } from '../../config/chain';
import { BLOCKS_PER_YEAR, TOKENS } from '../../config/constants';
import { getSushiswapPrice } from '../../config/util';
import { PoolInfo } from '../../interface/MasterChef';
import { PricesService } from '../../prices/PricesService';

/**
 * TODO: Implement the real pancake swap service once GraphQL queries
 * are updated and useable vs. string queries.
 */
@Service()
export class PancakeSwapService {
	@Inject()
	pricesService!: PricesService;

	private cache: NodeCache;

	constructor() {
		this.cache = new NodeCache({ stdTTL: 300, checkperiod: 480 });
	}

	async getPoolApr(chain: Chain, contract: string, poolId: number): Promise<number> {
		const cacheKey = `${chain}-${contract}-${poolId}`;
		const cachedPool: number | undefined = this.cache.get(cacheKey);
		if (cachedPool) {
			return cachedPool;
		}
		const masterChef = new ethers.Contract(contract, pancakeChefAbi, chain.provider);
		const [totalAllocPoint, sushiPerBlock, poolInfo, tokenPrice] = await Promise.all([
			masterChef.totalAllocPoint() as number,
			masterChef.sushiPerBlock() as number,
			masterChef.poolInfo(poolId) as PoolInfo,
			this.pricesService.getTokenPriceData(TOKENS.SUSHI),
		]);
		const depositToken = new ethers.Contract(poolInfo.lpToken, erc20Abi, chain.provider);
		const poolBalance = (await depositToken.balanceOf(contract)) / 1e18;
		const depositTokenValue = await getSushiswapPrice(poolInfo.lpToken);
		const poolValue = poolBalance * depositTokenValue.usd;
		const emissionScalar = poolInfo.allocPoint / totalAllocPoint;
		const sushiEmission = (sushiPerBlock / 1e18) * emissionScalar * BLOCKS_PER_YEAR * tokenPrice.usd;
		const poolApr = (sushiEmission / poolValue) * 100;
		this.cache.set(cacheKey, poolApr);
		return poolApr;
	}
}
