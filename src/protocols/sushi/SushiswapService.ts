import { Inject, Service } from '@tsed/di';
<<<<<<< HEAD
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../../cache/CacheService';
import { Chain } from '../../config/chain/chain';
import { BLOCKS_PER_YEAR, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import {
  getSdk,
  MasterChefsAndPoolsQuery,
  OrderDirection,
  Pool_OrderBy,
  Sdk as MasterChefGraphqlSdk,
} from '../../graphql/generated/master-chef';
import { combinePerformance, Performance, uniformPerformance } from '../../interface/Performance';
import { SettDefinition } from '../../interface/Sett';
import { getTokenPriceData } from '../../prices/prices-util';
import { PricesService } from '../../prices/PricesService';
import { TokensService } from '../../tokens/TokensService';
import { MASTERCHEF_URL } from '../../v1/util/constants';
import { SwapService } from '../common/SwapService';

@Service()
export class SushiswapService extends SwapService {
  @Inject()
  tokensService!: TokensService;
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  private masterChefGraphqlSdk: MasterChefGraphqlSdk;

  constructor() {
    super(SUSHISWAP_URL);
    const masterChefDaoGraphqlClient = new GraphQLClient(MASTERCHEF_URL);
    this.masterChefGraphqlSdk = getSdk(masterChefDaoGraphqlClient);
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<Performance> {
    const { depositToken } = sett;
    const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
    const cachedPool = this.cacheService.get<Performance>(cacheKey);
    if (cachedPool) {
      return cachedPool;
    }
    const [tradeFeePerformance, masterChefQuery] = await Promise.all([
      this.getSwapPerformance(depositToken),
      this.getMasterChef(),
    ]);
    const emissionPerformance = await this.getPoolApr(masterChefQuery, sett);
    if (!emissionPerformance) {
      this.cacheService.set(cacheKey, tradeFeePerformance);
      return tradeFeePerformance;
    }
    const combinedPerformance = combinePerformance(tradeFeePerformance, emissionPerformance);
    this.cacheService.set(cacheKey, combinedPerformance);
    return combinedPerformance;
  }

  async getPoolApr(masterChefQuery: MasterChefsAndPoolsQuery, sett: SettDefinition): Promise<Performance | undefined> {
    const masterChef = masterChefQuery.masterChefs[0];
    const pool = masterChefQuery.pools.find((p) => p.pair === sett.depositToken.toLowerCase());
    if (!pool) {
      return pool;
    }
    const [depositTokenPrice, sushiPrice] = await Promise.all([
      this.getPairPrice(pool.pair),
      getTokenPriceData(TOKENS.SUSHI),
    ]);
    const totalAllocPoint = masterChef.totalAllocPoint;
    const poolValue = pool.balance * depositTokenPrice.usd;
    const emissionScalar = pool.allocPoint / totalAllocPoint;
    const sushiEmission = (masterChef.sushiPerBlock / 1e18) * emissionScalar * BLOCKS_PER_YEAR * sushiPrice.usd;
    const poolApr = (sushiEmission / poolValue) * 100;
    return uniformPerformance(poolApr);
  }

  async getMasterChef(): Promise<MasterChefsAndPoolsQuery> {
    let masterChefData = this.cacheService.get<MasterChefsAndPoolsQuery>(SUSHI_CHEF);
    if (!masterChefData) {
      masterChefData = await this.masterChefGraphqlSdk.MasterChefsAndPools({
        first: 1,
        orderBy: Pool_OrderBy.AllocPoint,
        orderDirection: OrderDirection.Desc,
        where: { allocPoint_gt: 0 },
      });
      this.cacheService.set(SUSHI_CHEF, masterChefData);
    }
    return masterChefData;
  }
=======
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../../cache/CacheService';
import { erc20Abi, masterChefAbi } from '../../config/abi';
import { Chain } from '../../config/chain';
import { BLOCKS_PER_YEAR, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import { getSushiswapPrice } from '../../config/util';
import {
	getSdk,
	MasterChefsAndPoolsQuery,
	OrderDirection,
	Pool_OrderBy,
	Sdk as MasterChefGraphqlSdk,
} from '../../graphql/generated/master-chef';
import { PoolInfo } from '../../interface/MasterChef';
import { combinePerformance, Performance, uniformPerformance } from '../../interface/Performance';
import { SettDefinition } from '../../interface/Sett';
import { PriceService } from '../../prices/PricesService';
import { TokensService } from '../../tokens/TokensService';
import { MASTERCHEF_URL } from '../../v1/util/constants';
import { SwapService } from '../common/SwapService';

@Service()
export class SushiswapService extends SwapService {
	@Inject()
	tokensService!: TokensService;
	@Inject()
	priceService!: PriceService;
	@Inject()
	cacheService!: CacheService;

	private masterChefGraphqlSdk: MasterChefGraphqlSdk;

	constructor() {
		super(SUSHISWAP_URL);
		const masterChefDaoGraphqlClient = new GraphQLClient(MASTERCHEF_URL);
		this.masterChefGraphqlSdk = getSdk(masterChefDaoGraphqlClient);
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
		let masterChefData: MasterChefsAndPoolsQuery | undefined = this.cacheService.get<MasterChefsAndPoolsQuery>(
			SUSHI_CHEF,
		);
		if (!masterChefData) {
			masterChefData = await this.masterChefGraphqlSdk.MasterChefsAndPools({
				first: 1,
				orderBy: Pool_OrderBy.AllocPoint,
				orderDirection: OrderDirection.Desc,
				where: { allocPoint_gt: 0 },
			});
			this.cacheService.set(SUSHI_CHEF, masterChefData);
		}
		const masterChefPools = masterChefData.pools;
		const sushiPool = masterChefPools.find((pool) => depositToken.toLowerCase() === pool.pair);
		if (sushiPool) {
			return parseInt(sushiPool.id);
		}
		return sushiPool;
	}
>>>>>>> 86c445a (chore: lint formatting)
}
