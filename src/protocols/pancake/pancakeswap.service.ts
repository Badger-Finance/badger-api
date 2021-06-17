import { formatEther } from '@ethersproject/units';
import { Inject, Service } from '@tsed/di';
import { BigNumber, ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { erc20Abi } from '../../config/abi/erc20.abi';
import { pancakeChefAbi } from '../../config/abi/pancake-chec.abi';
import { PANCAKE_CHEF, PANCAKESWAP_URL, TOKENS } from '../../config/constants';
import { PricesService } from '../../prices/prices.service';
import { getTokenPriceData } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { SwapService } from '../common/swap.service';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolInfo } from '../interfaces/pool-info.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource, ValueSource } from '../interfaces/value-source.interface';

@Service()
export class PancakeSwapService extends SwapService {
  @Inject()
  pricesService!: PricesService;

  constructor() {
    super(PANCAKESWAP_URL, 'Pancakeswap');
  }

  async getPairPerformance(chain: Chain, sett: SettDefinition): Promise<ValueSource[]> {
    const { depositToken } = sett;
    const [tradeFeePerformance, poolApr] = await Promise.all([
      this.getSwapPerformance(depositToken),
      this.getPoolApr(chain, PancakeSwapService.getPoolId(sett.depositToken)),
    ]);
    return [tradeFeePerformance, poolApr];
  }

  async getPoolApr(chain: Chain, poolId: number): Promise<ValueSource> {
    let emissionSource = createValueSource('Cake Rewards', uniformPerformance(0));
    if (!poolId) {
      return emissionSource;
    }
    emissionSource = await PancakeSwapService.getEmissionSource(chain, poolId);
    return emissionSource;
  }

  static async getEmissionSource(chain: Chain, poolId: number): Promise<ValueSource> {
    const emissionSource = createValueSource('Cake Rewards', uniformPerformance(0));
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
    const cakeEmission = parseFloat(formatEther(cakePerBlock)) * emissionScalar * chain.blocksPerYear * tokenPrice.usd;
    emissionSource.performance = uniformPerformance((cakeEmission / poolValue) * 100);
    emissionSource.apr = emissionSource.performance.threeDay;
    emissionSource.harvestable = true;
    return emissionSource;
  }

  // TODO: Remove this once pancakeswap masterchef subgraph has synced
  static getPoolId(depositToken: string): number {
    const poolMap: PoolMap = {};
    poolMap[TOKENS.PANCAKE_BNB_BTCB] = 262;
    poolMap[TOKENS.PANCAKE_BBADGER_BTCB] = 332;
    poolMap[TOKENS.PANCAKE_BDIGG_BTCB] = 331;
    return poolMap[depositToken];
  }
}
