import { Inject, Service } from '@tsed/di';
import { ethers } from 'ethers';
import { GraphQLClient } from 'graphql-request';
import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { masterChefAbi } from '../../config/abi/sushi-chef.abi';
import { MASTERCHEF_URL, SUSHI_CHEF, SUSHISWAP_URL, TOKENS } from '../../config/constants';
import { getSdk, MasterChefsAndPoolsQuery, OrderDirection, Pool_OrderBy } from '../../graphql/generated/master-chef';
import { PricesService } from '../../prices/prices.service';
import { getPrice } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokensService } from '../../tokens/tokens.service';
import { SwapService } from '../common/swap.service';
import { uniformPerformance } from '../interfaces/performance.interface';
import { UserInfo } from '../interfaces/user-info.interface';
import { createValueSource, ValueSource } from '../interfaces/value-source.interface';
import { xSushiApr } from '../interfaces/xsushi-apr.interface';

@Service()
export class SushiswapService extends SwapService {
  public static xSushiAprEndpoint = 'https://apy.sushiswap.fi/xsushi';

  @Inject()
  tokensService!: TokensService;
  @Inject()
  pricesService!: PricesService;

  constructor() {
    super(SUSHISWAP_URL, 'Sushiswap');
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    const { depositToken } = sett;
    return Promise.all([this.getSwapPerformance(depositToken), this.getPoolApr(chain, sett)]);
  }

  async getPoolApr(chain: Chain, sett: SettDefinition): Promise<ValueSource> {
    const masterChefData = await SushiswapService.getMasterChef();
    return SushiswapService.getEmissionSource(chain, sett, masterChefData);
  }

  static async getEmissionSource(
    chain: Chain,
    sett: SettDefinition,
    masterChefData: MasterChefsAndPoolsQuery,
  ): Promise<ValueSource> {
    const { depositToken } = sett;
    const masterChef = masterChefData.masterChefs[0];
    const pool = masterChefData.pools.find((p) => p.pair === depositToken.toLowerCase());
    if (!pool || !sett.strategy) {
      return createValueSource('xSushi Rewards', uniformPerformance(0));
    }
    const sushiChef = new ethers.Contract(SUSHI_CHEF, masterChefAbi, chain.provider);
    const [depositTokenPrice, sushiPrice] = await Promise.all([getPrice(pool.pair), getPrice(TOKENS.SUSHI)]);
    const totalAllocPoint = masterChef.totalAllocPoint;
    const strategyInfo: UserInfo = await sushiChef.userInfo(pool.id, sett.strategy);

    let sushiApr = 0;
    if (strategyInfo.amount.gt(0)) {
      const xSushiResponse = await fetch(SushiswapService.xSushiAprEndpoint);
      let xSushiAprMultiplier = 1;
      if (xSushiResponse.ok) {
        const xSushiApr: xSushiApr = await xSushiResponse.json();
        xSushiAprMultiplier += parseFloat(xSushiApr.APR) / 100;
      }
      const poolValue = pool.balance * depositTokenPrice.usd;
      const emissionScalar = pool.allocPoint / totalAllocPoint;
      const sushiEmission = masterChef.sushiPerBlock * emissionScalar * chain.blocksPerYear * sushiPrice.usd;
      sushiApr = (sushiEmission / poolValue) * 100 * xSushiAprMultiplier;
    }
    return createValueSource('xSushi Rewards', uniformPerformance(sushiApr));
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
