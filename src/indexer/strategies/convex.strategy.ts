import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { cvxBoosterAbi } from '../../config/abi/cvx-booster.abi';
import { cvxRewardsAbi } from '../../config/abi/cvx-rewards.abi';
import { erc20Abi } from '../../config/abi/erc20.abi';
import { CURVE_API_URL, ONE_YEAR_SECONDS, TOKENS } from '../../config/constants';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../protocols/enums/source-type.enum';
import { CachedValueSource } from '../../protocols/interfaces/cached-value-source.interface';
import { CvxPoolInfo } from '../../protocols/interfaces/cvx-pool-info.interface';
import { Performance, uniformPerformance } from '../../protocols/interfaces/performance.interface';
import { PoolMap } from '../../protocols/interfaces/pool-map.interface';
import { createValueSource } from '../../protocols/interfaces/value-source.interface';
import { tokenEmission } from '../../protocols/protocols.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { getCachedSett, VAULT_SOURCE } from '../../setts/setts.utils';
import { getToken } from '../../tokens/tokens.utils';
import { valueSourceToCachedValueSource } from '../indexer.utils';

/* Strategy Definitions */
export const cvxRewards = '0xCF50b810E57Ac33B91dCF525C6ddd9881B139332';
export const cvxCrvRewards = '0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e';
export const threeCrvRewards = '0x7091dbb7fcbA54569eF1387Ac89Eb2a5C9F6d2EA';
export const cvxChef = '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d';
export const cvxBooster = '0xF403C135812408BFbE8713b5A23a04b3D48AAE31';

/* Protocol Definitions */
const curvePoolApr: { [address: string]: string } = {
  [TOKENS.CRV_RENBTC]: 'ren2',
  [TOKENS.CRV_SBTC]: 'rens',
  [TOKENS.CRV_TBTC]: 'tbtc',
  [TOKENS.CRV_HBTC]: 'hbtc',
  [TOKENS.CRV_PBTC]: 'pbtc',
  [TOKENS.CRV_OBTC]: 'obtc',
  [TOKENS.CRV_BBTC]: 'bbtc',
};

const cvxPoolId: PoolMap = {
  [TOKENS.CRV_HBTC]: 8,
  [TOKENS.CRV_PBTC]: 18,
  [TOKENS.CRV_BBTC]: 19,
  [TOKENS.CRV_OBTC]: 20,
};

// const chefPoolId: PoolMap = {
//   [TOKENS.SUSHI_CVX_ETH]: 1,
//   [TOKENS.SUSHI_CRV_CVXCRV]: 2,
// };

export async function getConvexApySnapshots(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  const singleRewards = await Promise.all([getCvxRewards(chain, settDefinition), getCurvePerformance(settDefinition)]);
  const multiRewards = await Promise.all([
    getHarvestable(chain, settDefinition),
    getCvxCrvRewards(chain, settDefinition),
  ]);
  return [...singleRewards, ...multiRewards.flatMap((reward) => reward)];
}

async function getHarvestable(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const booster = new ethers.Contract(cvxBooster, cvxBoosterAbi, chain.provider);
  const poolInfo: CvxPoolInfo = await booster.poolInfo(cvxPoolId[settDefinition.depositToken]);
  const crv = new ethers.Contract(poolInfo.crvRewards, cvxRewardsAbi, chain.provider);

  const crvToken = getToken(TOKENS.CRV);
  const cvxToken = getToken(TOKENS.CVX);

  // get prices
  const [cvxPrice, crvPrice, depositPrice] = await Promise.all([
    getPrice(cvxToken.address),
    getPrice(TOKENS.CRV),
    getPrice(settDefinition.depositToken),
  ]);

  // get rewards
  const crvReward = parseFloat(ethers.utils.formatEther(await crv.currentRewards()));
  const cvxReward = await getCvxMint(chain, crvReward);
  const depositLocked = parseFloat(ethers.utils.formatEther(await crv.totalSupply()));

  // get apr params
  const duration = (await crv.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;
  const poolValue = depositLocked * depositPrice.usd;

  // calculate CRV rewards
  const crvEmission = crvReward * crvPrice.usd * scalar;
  const crvUnerlyingApr = (crvEmission / poolValue) * 10;
  const crvEmissionApr = (crvEmission / poolValue) * 60;

  // calculate CVX rewards
  const cvxEmission = cvxReward * cvxPrice.usd * scalar;
  const cvxUnderlyingApr = (cvxEmission / poolValue) * 10;
  const cvxEmissionApr = (cvxEmission / poolValue) * 60;

  // create value sources
  const totalUnderlyingApr = crvUnerlyingApr + cvxUnderlyingApr;
  const compoundValueSource = createValueSource(VAULT_SOURCE, uniformPerformance(totalUnderlyingApr), true);
  const crvValueSource = createValueSource('cvxCRV Rewards', uniformPerformance(crvEmissionApr));
  const cvxValueSource = createValueSource('CVX Rewards', uniformPerformance(cvxEmissionApr));

  // create cached value sources
  const cachedCompounding = valueSourceToCachedValueSource(compoundValueSource, settDefinition, SourceType.Compound);
  const cachedCrvEmission = valueSourceToCachedValueSource(crvValueSource, settDefinition, tokenEmission(crvToken));
  const cachedCvxEmission = valueSourceToCachedValueSource(cvxValueSource, settDefinition, tokenEmission(cvxToken));

  // calculate extra rewards value sources
  const extraRewardsLength = await crv.extraRewardsLength();
  const cachedExtraSources: CachedValueSource[] = [];
  for (let i = 0; i < extraRewardsLength; i++) {
    const rewards = await crv.extraRewards(i);
    const virtualRewards = new ethers.Contract(rewards, cvxRewardsAbi, chain.provider);
    const rewardToken = getToken(await virtualRewards.rewardToken());
    const rewardTokenPrice = await getPrice(rewardToken.address);
    const rewardAmount = parseFloat(ethers.utils.formatEther(await virtualRewards.currentRewards()));
    const rewardEmission = rewardAmount * rewardTokenPrice.usd * scalar;
    const rewardApr = (rewardEmission / poolValue) * 70;
    const rewardSource = createValueSource(`${rewardToken.symbol} Rewards`, uniformPerformance(rewardApr));
    cachedExtraSources.push(valueSourceToCachedValueSource(rewardSource, settDefinition, tokenEmission(rewardToken)));
  }

  return [cachedCompounding, cachedCrvEmission, cachedCvxEmission, ...cachedExtraSources];
}

async function getCvxRewards(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource> {
  // setup contracts + sett
  const sett = await getCachedSett(settDefinition);
  const cvx = new ethers.Contract(cvxRewards, cvxRewardsAbi, chain.provider);

  // get prices
  const cvxPrice = await getPrice(TOKENS.CVX);
  const cvxCrvPrice = await getPrice(TOKENS.CVXCRV);

  // get rewards
  const cvxCrvReward = parseFloat(ethers.utils.formatEther(await cvx.currentRewards()));
  const cvxLocked = parseFloat(ethers.utils.formatEther(await cvx.totalSupply()));

  // get apr params
  const duration = (await cvx.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;
  const settBalance = parseFloat(ethers.utils.formatEther(await cvx.balanceOf(settDefinition.strategy)));
  const settBalanceValue = settBalance * cvxPrice.usd;
  if (sett.value === 0 || settBalance === 0) {
    return valueSourceToCachedValueSource(
      createValueSource('CVX Rewards', uniformPerformance(0)),
      settDefinition,
      SourceType.Emission,
    );
  }
  const valueScalar = settBalanceValue / sett.value;

  // calculate CVX rewards
  const emission = cvxCrvReward * cvxCrvPrice.usd * scalar;
  const poolValue = cvxLocked * cvxPrice.usd;
  const poolApr = (emission / poolValue) * 100;
  const valueSource = createValueSource('CVX Rewards', uniformPerformance(poolApr * valueScalar));
  return valueSourceToCachedValueSource(valueSource, settDefinition, tokenEmission(getToken(TOKENS.CVX)));
}

async function getCvxCrvRewards(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  // setup contracts + sett
  const sett = await getCachedSett(settDefinition);
  const cvxCrv = new ethers.Contract(cvxCrvRewards, cvxRewardsAbi, chain.provider);

  // get prices
  const [cvxPrice, cvxCrvPrice, crvPrice] = await Promise.all([
    getPrice(TOKENS.CVX),
    getPrice(TOKENS.CVXCRV),
    getPrice(TOKENS.CRV),
  ]);

  // get rewards
  const crvReward = parseFloat(ethers.utils.formatEther(await cvxCrv.currentRewards()));
  const cvxReward = await getCvxMint(chain, crvReward);
  const cvxCrvLocked = parseFloat(ethers.utils.formatEther(await cvxCrv.totalSupply()));

  // get apr params
  const duration = (await cvxCrv.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;
  const settBalance = parseFloat(ethers.utils.formatEther(await cvxCrv.balanceOf(settDefinition.strategy)));
  if (settBalance === 0) {
    return [];
  }
  const settBalanceValue = settBalance * cvxPrice.usd;
  const valueScalar = settBalanceValue / sett.value;
  const poolValue = cvxCrvLocked * cvxCrvPrice.usd;

  // calculate cvxCRV rewards
  const cvxCrvEmission = crvReward * crvPrice.usd * scalar;
  const cvxCrvApr = (cvxCrvEmission / poolValue) * 100;
  const cvxCrvValueSource = createValueSource('cvxCRV Rewards', uniformPerformance(cvxCrvApr * valueScalar));
  const cachedCvxCrvSource = valueSourceToCachedValueSource(
    cvxCrvValueSource,
    settDefinition,
    tokenEmission(getToken(TOKENS.CVXCRV)),
  );

  // calculate CVX rewards
  const cvxEmission = cvxReward * cvxPrice.usd * scalar;
  const cvxApr = (cvxEmission / poolValue) * 100;
  const cvxValueSource = createValueSource('CVX Rewards', uniformPerformance(cvxApr * valueScalar));
  const cachedCvxSource = valueSourceToCachedValueSource(
    cvxValueSource,
    settDefinition,
    tokenEmission(getToken(TOKENS.CVX)),
  );

  return [cachedCvxCrvSource, cachedCvxSource];
}

export async function getCurvePerformance(settDefinition: SettDefinition): Promise<CachedValueSource> {
  const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
  const assetKey = settDefinition.depositToken;
  const tradeFeePerformance: Performance = {
    oneDay: curveData.apy.day[curvePoolApr[assetKey]] * 100,
    threeDay: curveData.apy.day[curvePoolApr[assetKey]] * 100,
    sevenDay: curveData.apy.week[curvePoolApr[assetKey]] * 100,
    thirtyDay: curveData.apy.month[curvePoolApr[assetKey]] * 100,
  };
  const valueSource = createValueSource('Curve LP Fees', tradeFeePerformance);
  return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.TradeFee);
}

/* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */

// constants
const cliffSize = 100000 * 1e18; // new cliff every 100,000 tokens
const cliffCount = 1000; // 1,000 cliffs
const maxSupply = 100000000 * 1e18; // 100 mil max supply

async function getCvxMint(chain: Chain, crvEarned: number): Promise<number> {
  const cvx = new ethers.Contract(TOKENS.CVX, erc20Abi, chain.provider);

  // first get total supply
  const cvxTotalSupply = await cvx.totalSupply();

  // get current cliff
  const currentCliff = cvxTotalSupply / cliffSize;

  // if current cliff is under the max
  if (currentCliff < cliffCount) {
    // get remaining cliffs
    const remaining = cliffCount - currentCliff;

    // multiply ratio of remaining cliffs to total cliffs against amount CRV received
    let cvxEarned = (crvEarned * remaining) / cliffCount;

    // double check we have not gone over the max supply
    const amountTillMax = maxSupply - cvxTotalSupply;
    if (cvxEarned > amountTillMax) {
      cvxEarned = amountTillMax;
    }
    return cvxEarned;
  }
  return 0;
}
