import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_SECONDS, SWAPR_SUBGRAPH_URL } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { SwaprStaking__factory } from '../../contracts';
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

const SWAPR_STAKING = {
  [TOKENS.BARB_SWP_SWAPR_WETH]: '0xe2A7CF0DEB83F2BC2FD15133a02A24B9981f2c17',
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
  const stakingContract = SwaprStaking__factory.connect(SWAPR_STAKING[settDefinition.settToken], chain.provider);

  const [duration, totalSupply, lpTokenPrice, sett] = await Promise.all([
    stakingContract.secondsDuration(),
    stakingContract.totalStakedTokensAmount(),
    getPrice(settDefinition.depositToken),
    getCachedSett(settDefinition),
  ]);
  const stakedAmount = formatBalance(totalSupply) * lpTokenPrice.usd;
  const strategyFeeMultiplier = 1 - (sett.strategy.performanceFee + sett.strategy.strategistFee) / 1000;

  let sources = [];
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
        `${rewardToken.name} Rewards`,
        uniformPerformance(apr * strategyFeeMultiplier),
      );
      sources.push(valueSourceToCachedValueSource(swaprEmission, settDefinition, tokenEmission(rewardToken)));
      tokenIndex++;
    } catch {
      break;
    }
  }

  return sources;
}
