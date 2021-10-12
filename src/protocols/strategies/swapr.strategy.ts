import { ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_SECONDS, SWAPR_SUBGRAPH_URL } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { SwaprStaking__factory } from '../../contracts';
import { SwaprStrategy__factory } from '../../contracts/factories/SwaprStrategy__factory';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { getCachedSett } from '../../setts/setts.utils';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';
import { getUniV2SwapValue } from './strategy.utils';

const COMPOUND_SCALARS = {
  [TOKENS.BARB_SWP_WBTC_WETH]: 0.5,
};

export class SwaprStrategy {
  static async getValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    return Promise.all([
      getUniV2SwapValue(SWAPR_SUBGRAPH_URL, settDefinition),
      ...(await getSwaprEmission(chain, settDefinition)),
    ]);
  }
}

async function getSwaprEmission(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  if (settDefinition.settToken === TOKENS.BARB_SWP_SWPR_WETH) {
    return [];
  }
  const compoundScalar = COMPOUND_SCALARS[settDefinition.settToken] ?? 1;
  const helperToken = getToken(TOKENS.BARB_SWP_SWPR_WETH);
  const cachedSett = await getCachedSett(settDefinition);
  const { strategy } = cachedSett;
  if (strategy.address === ethers.constants.AddressZero) {
    return [];
  }
  const swaprStrategy = SwaprStrategy__factory.connect(strategy.address, chain.provider);
  const stakingContractAddr = await swaprStrategy.stakingContract();
  const stakingContract = SwaprStaking__factory.connect(stakingContractAddr, chain.provider);

  const [duration, totalSupply, lpTokenPrice, sett] = await Promise.all([
    stakingContract.secondsDuration(),
    stakingContract.totalStakedTokensAmount(),
    getPrice(settDefinition.depositToken),
    getCachedSett(settDefinition),
  ]);
  const stakedAmount = formatBalance(totalSupply) * lpTokenPrice.usd;
  const strategyFeeMultiplier = 1 - (sett.strategy.performanceFee + sett.strategy.strategistFee) / 10000;

  const sources = [];
  let tokenIndex = 0;
  while (true) {
    try {
      const rewardInfo = await stakingContract.rewards(tokenIndex);
      const { token, amount } = rewardInfo;
      const rewardToken = getToken(token);
      const rewardTokenPrice = await getPrice(token);
      const rewardEmission = formatBalance(amount) * rewardTokenPrice.usd;
      const apr = (((ONE_YEAR_SECONDS / duration.toNumber()) * rewardEmission) / stakedAmount) * 100;
      const swaprEmission = createValueSource(
        `${helperToken.name} Rewards`,
        uniformPerformance(apr * strategyFeeMultiplier * compoundScalar),
      );
      sources.push(valueSourceToCachedValueSource(swaprEmission, settDefinition, tokenEmission(rewardToken)));
      tokenIndex++;
    } catch {
      break;
    }
  }

  return sources;
}
