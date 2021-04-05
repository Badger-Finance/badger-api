import { Inject, Service } from '@tsed/di';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../../cache/CacheService';
import { Chain } from '../../chains/config/chain.config';
import { Ethereum } from '../../chains/config/eth.config';
import { MASTERCHEF_URL, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import {
  getSdk,
  MasterChefsAndPoolsQuery,
  OrderDirection,
  Pool_OrderBy,
  Sdk as MasterChefGraphqlSdk,
} from '../../graphql/generated/master-chef';
import { SettDefinition } from '../../interface/Sett';
import { getTokenPriceData } from '../../prices/prices-util';
import { PricesService } from '../../prices/PricesService';
import { TokensService } from '../../tokens/TokensService';
import { SwapService } from '../common/SwapService';
import { uniformPerformance } from '../interfaces/performance.interface';
import { ValueSource } from '../interfaces/value-source.interface';

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
    super(SUSHISWAP_URL, 'Sushiswap');
    const masterChefDaoGraphqlClient = new GraphQLClient(MASTERCHEF_URL);
    this.masterChefGraphqlSdk = getSdk(masterChefDaoGraphqlClient);
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    const { depositToken } = sett;
    const cacheKey = CacheService.getCacheKey(chain.name, depositToken);
    const cachedValueSource = this.cacheService.get<ValueSource[]>(cacheKey);
    if (cachedValueSource) {
      return cachedValueSource;
    }
    const sources = await Promise.all([this.getSwapPerformance(depositToken), this.getPoolApr(sett)]);
    this.cacheService.set(cacheKey, sources);
    return sources;
  }

  async getPoolApr(sett: SettDefinition): Promise<ValueSource> {
    const masterChefQuery = await this.getMasterChef();
    const masterChef = masterChefQuery.masterChefs[0];
    const pool = masterChefQuery.pools.find((p) => p.pair === sett.depositToken.toLowerCase());
    const emissionSource = {
      name: 'Sushi',
      apy: 0,
      performance: uniformPerformance(0),
    };
    if (!pool) {
      return emissionSource;
    }
    const [depositTokenPrice, sushiPrice] = await Promise.all([
      this.getPairPrice(pool.pair),
      getTokenPriceData(TOKENS.SUSHI),
    ]);
    const totalAllocPoint = masterChef.totalAllocPoint;
    const poolValue = pool.balance * depositTokenPrice.usd;
    const emissionScalar = pool.allocPoint / totalAllocPoint;
    const sushiEmission = masterChef.sushiPerBlock * emissionScalar * Ethereum.BLOCKS_PER_YEAR * sushiPrice.usd;
    emissionSource.performance = uniformPerformance((sushiEmission / poolValue) * 100);
    emissionSource.apy = emissionSource.performance.threeDay;
    return emissionSource;
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
