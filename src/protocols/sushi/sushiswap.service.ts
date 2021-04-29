import { Inject, Service } from '@tsed/di';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../../cache/cache.service';
import { Chain } from '../../chains/config/chain.config';
import { MASTERCHEF_URL, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import { getSdk, MasterChefsAndPoolsQuery, OrderDirection, Pool_OrderBy } from '../../graphql/generated/master-chef';
import { PricesService } from '../../prices/prices.service';
import { getPrice } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokensService } from '../../tokens/tokens.service';
import { SwapService } from '../common/swap.service';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource, ValueSource } from '../interfaces/value-source.interface';

@Service()
export class SushiswapService extends SwapService {
  @Inject()
  tokensService!: TokensService;
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  constructor() {
    super(SUSHISWAP_URL, 'Sushiswap');
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    const { depositToken } = sett;
    const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
    const cachedValueSource = this.cacheService.get<ValueSource[]>(cacheKey);
    if (cachedValueSource) {
      return cachedValueSource;
    }
    const sources = await Promise.all([this.getSwapPerformance(depositToken), this.getPoolApr(chain, sett)]);
    this.cacheService.set(cacheKey, sources);
    return sources;
  }

  async getPoolApr(chain: Chain, sett: SettDefinition): Promise<ValueSource> {
    let masterChefData = this.cacheService.get<MasterChefsAndPoolsQuery>(SUSHI_CHEF);
    if (!masterChefData) {
      masterChefData = await SushiswapService.getMasterChef();
      this.cacheService.set(SUSHI_CHEF, masterChefData);
    }
    return SushiswapService.getEmissionSource(chain, sett.depositToken, masterChefData);
  }

  static async getEmissionSource(
    chain: Chain,
    depositToken: string,
    masterChefData: MasterChefsAndPoolsQuery,
  ): Promise<ValueSource> {
    const masterChef = masterChefData.masterChefs[0];
    const pool = masterChefData.pools.find((p) => p.pair === depositToken.toLowerCase());
    const emissionSource = createValueSource('Sushi Rewards', uniformPerformance(0));
    if (!pool) {
      return emissionSource;
    }
    const [depositTokenPrice, sushiPrice] = await Promise.all([getPrice(pool.pair), getPrice(TOKENS.SUSHI)]);
    const totalAllocPoint = masterChef.totalAllocPoint;
    const poolValue = pool.balance * depositTokenPrice.usd;
    const emissionScalar = pool.allocPoint / totalAllocPoint;
    const sushiEmission = masterChef.sushiPerBlock * emissionScalar * chain.blocksPerYear * sushiPrice.usd;
    emissionSource.performance = uniformPerformance((sushiEmission / poolValue) * 100);
    emissionSource.apr = emissionSource.performance.threeDay;
    return emissionSource;
  }

  static async getMasterChef(): Promise<MasterChefsAndPoolsQuery> {
    const masterChefDaoGraphqlClient = new GraphQLClient(MASTERCHEF_URL);
    const masterChefGraphqlSdk = getSdk(masterChefDaoGraphqlClient);
    return masterChefGraphqlSdk.MasterChefsAndPools({
      first: 1,
      orderBy: Pool_OrderBy.AllocPoint,
      orderDirection: OrderDirection.Desc,
      where: { allocPoint_gt: 0 },
    });
  }
}
