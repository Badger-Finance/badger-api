import { ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_SECONDS, SWAPR_SUBGRAPH_URL } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { SwaprStaking__factory } from '../../contracts';
import { SwaprStrategy__factory } from '../../contracts/factories/SwaprStrategy__factory';
import { valueSourceToCachedValueSource } from '../../indexers/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { getCachedVault } from '../../vaults/vaults.utils';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';
import { getUniV2SwapValue } from './strategy.utils';

// scalars are the "emitted" proportion
const COMPOUND_SCALARS = {
  [TOKENS.BARB_SWP_WBTC_WETH]: 0.5,
  [TOKENS.BARB_SWP_BADGER_WETH]: 1,
  [TOKENS.BARB_SWP_IBBTC_WETH]: 1,
};

export class SwaprStrategy {
  static async getValueSources(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    return Promise.all([
      getUniV2SwapValue(SWAPR_SUBGRAPH_URL, vaultDefinition),
      ...(await getSwaprEmission(chain, vaultDefinition)),
    ]);
  }
}

async function getSwaprEmission(chain: Chain, vaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const compoundScalar = COMPOUND_SCALARS[vaultDefinition.vaultToken] ?? 0;
  const helperToken = getToken(TOKENS.BARB_SWP_SWPR_WETH);
  const cachedSett = await getCachedVault(vaultDefinition);
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
    getPrice(vaultDefinition.depositToken),
    getCachedVault(vaultDefinition),
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
      sources.push(valueSourceToCachedValueSource(swaprEmission, vaultDefinition, tokenEmission(rewardToken)));
      tokenIndex++;
    } catch (err) {
      break;
    }
  }

  return sources;
}
