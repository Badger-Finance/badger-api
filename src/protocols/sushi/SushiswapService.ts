import { Inject, Service } from '@tsed/di';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../../cache/CacheService';
import { Chain } from '../../chains/config/chain.config';
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
}
