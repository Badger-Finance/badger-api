import { UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { Ethereum, ethSetts } from '../../chains/config/eth.config';
import { curvePoolAbi, oldCurvePoolAbi } from '../../config/abi/curve-pool.abi';
import { curveRegistryAbi } from '../../config/abi/curve-registry.abi';
import { cvxBoosterAbi } from '../../config/abi/cvx-booster.abi';
import { cvxRewardsAbi } from '../../config/abi/cvx-rewards.abi';
import { erc20Abi } from '../../config/abi/erc20.abi';
import { CURVE_API_URL, CURVE_CRYPTO_API_URL, ONE_YEAR_SECONDS, TOKENS } from '../../config/constants';
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
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { getToken, toCachedBalance } from '../../tokens/tokens.utils';
import { tokenBalancesToCachedLiquidityPoolTokenBalance, valueSourceToCachedValueSource } from '../indexer.utils';

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
  [TOKENS.CRV_TRICRYPTO]: 'tricrypto',
};

const cvxPoolId: PoolMap = {
  [TOKENS.CRV_HBTC]: 8,
  [TOKENS.CRV_PBTC]: 18,
  [TOKENS.CRV_BBTC]: 19,
  [TOKENS.CRV_OBTC]: 20,
  [TOKENS.CRV_TRICRYPTO]: 37,
};

export async function getConvexApySnapshots(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  const sources = [];

  switch (settDefinition.settToken) {
    case TOKENS.BCVX:
      sources.push(await getCvxRewards(chain, settDefinition, true));
      break;
    case TOKENS.BCVXCRV:
      const compounding = await getCvxCrvRewards(chain, settDefinition, true);
      compounding.forEach((s) => sources.push(s));
      break;
    default:
      const singleRewards = await Promise.all([
        getCvxRewards(chain, settDefinition),
        getCurvePerformance(settDefinition),
      ]);
      const multiRewards = await Promise.all([
        getHarvestable(chain, settDefinition),
        getCvxCrvRewards(chain, settDefinition),
      ]);
      singleRewards.forEach((s) => sources.push(s));
      multiRewards.flatMap((s) => s).forEach((s) => sources.push(s));
  }

  return sources;
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

async function getCvxRewards(
  chain: Chain,
  settDefinition: SettDefinition,
  compound?: boolean,
): Promise<CachedValueSource> {
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
  const source = compound ? VAULT_SOURCE : 'CVX Rewards';

  if (!compound && (sett.value === 0 || settBalance === 0)) {
    return valueSourceToCachedValueSource(
      createValueSource(source, uniformPerformance(0)),
      settDefinition,
      SourceType.Emission,
    );
  }
  const valueScalar = settBalanceValue / sett.value;

  // calculate CVX rewards
  const emission = cvxCrvReward * cvxCrvPrice.usd * scalar;
  const poolValue = cvxLocked * cvxPrice.usd;
  const cvxCrvApr = (emission / poolValue) * 100;
  if (compound) {
    const valueSource = createValueSource(source, uniformPerformance(cvxCrvApr));
    return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.Compound);
  } else {
    const valueSource = createValueSource(source, uniformPerformance(cvxCrvApr * valueScalar));
    return valueSourceToCachedValueSource(valueSource, settDefinition, tokenEmission(getToken(TOKENS.CVX)));
  }
}

async function getCvxCrvRewards(
  chain: Chain,
  settDefinition: SettDefinition,
  compound?: boolean,
): Promise<CachedValueSource[]> {
  // setup contracts + sett
  const sett = await getCachedSett(settDefinition);
  const cvxCrv = new ethers.Contract(cvxCrvRewards, cvxRewardsAbi, chain.provider);
  const threeCrv = new ethers.Contract(threeCrvRewards, cvxRewardsAbi, chain.provider);

  // get prices
  const [cvxPrice, cvxCrvPrice, crvPrice, threeCrvPrice] = await Promise.all([
    getPrice(TOKENS.CVX),
    getPrice(TOKENS.CVXCRV),
    getPrice(TOKENS.CRV),
    getPrice(TOKENS.CRV_THREE),
  ]);

  // get rewards
  const crvReward = parseFloat(ethers.utils.formatEther(await cvxCrv.currentRewards()));
  const threeCrvReward = parseFloat(ethers.utils.formatEther(await threeCrv.currentRewards()));
  const cvxReward = await getCvxMint(chain, crvReward);
  const cvxCrvLocked = parseFloat(ethers.utils.formatEther(await cvxCrv.totalSupply()));

  // get apr params
  const duration = (await cvxCrv.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;
  const settBalance = parseFloat(ethers.utils.formatEther(await cvxCrv.balanceOf(settDefinition.strategy)));
  if (!compound && settBalance === 0) {
    return [];
  }
  const settBalanceValue = settBalance * cvxPrice.usd;
  const valueScalar = settBalanceValue / sett.value;
  const poolValue = cvxCrvLocked * cvxCrvPrice.usd;
  const sources = [];

  // calculate CVX rewards
  const cvxEmission = cvxReward * cvxPrice.usd * scalar;
  const cvxApr = (cvxEmission / poolValue) * 100;

  // calculate cvxCRV + 3CRV rewards
  const cvxCrvEmission = crvReward * crvPrice.usd * scalar;
  const cvxCrvApr = (cvxCrvEmission / poolValue) * 100;
  const threeCrvEmission = threeCrvReward * threeCrvPrice.usd * scalar;
  const threeCrvApr = (threeCrvEmission / poolValue) * 100;

  if (compound) {
    const totalApr = cvxCrvApr + threeCrvApr + cvxApr;
    const cvxCrvValueSource = createValueSource(VAULT_SOURCE, uniformPerformance(totalApr), true);
    const cachedCvxCrvSource = valueSourceToCachedValueSource(cvxCrvValueSource, settDefinition, SourceType.Compound);
    sources.push(cachedCvxCrvSource);
  } else {
    const cvxValueSource = createValueSource('CVX Rewards', uniformPerformance(cvxApr * valueScalar));
    const cachedCvxSource = valueSourceToCachedValueSource(
      cvxValueSource,
      settDefinition,
      tokenEmission(getToken(TOKENS.CVX)),
    );
    sources.push(cachedCvxSource);

    const totalApr = cvxCrvApr + threeCrvApr;
    const cvxCrvValueSource = createValueSource('cvxCRV Rewards', uniformPerformance(totalApr * valueScalar));
    const cachedCvxCrvSource = valueSourceToCachedValueSource(
      cvxCrvValueSource,
      settDefinition,
      tokenEmission(getToken(TOKENS.CVXCRV)),
    );
    sources.push(cachedCvxCrvSource);
  }

  return sources;
}

export async function getCurvePerformance(settDefinition: SettDefinition): Promise<CachedValueSource> {
  let curveData = await fetch(CURVE_API_URL).then((response) => response.json());
  const assetKey = settDefinition.depositToken;
  const missingEntry = () => !curveData.apy.week[curvePoolApr[assetKey]];

  // try the secondary apy options, if not avilable give up
  if (missingEntry()) {
    curveData = await fetch(CURVE_CRYPTO_API_URL).then((response) => response.json());
    if (missingEntry()) {
      const valueSource = createValueSource('Curve LP Fees', uniformPerformance(0));
      return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.TradeFee);
    }
  }

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

export async function getCurveTokenPrice(chain: Chain, depositToken: string): Promise<TokenPrice> {
  const deposit = getToken(depositToken);
  const poolBalance = await getCurvePoolBalance(chain, depositToken);
  const token = new ethers.Contract(depositToken, erc20Abi, chain.provider);
  const poolValueUsd = poolBalance.reduce((total, balance) => (total += balance.valueUsd), 0);
  const poolValueEth = poolBalance.reduce((total, balance) => (total += balance.valueEth), 0);
  const totalSupply = await token.totalSupply();
  const supply = totalSupply / Math.pow(10, deposit.decimals);
  const usd = poolValueUsd / supply;
  const eth = poolValueEth / supply;
  return {
    name: deposit.name,
    address: deposit.address,
    usd,
    eth,
  };
}

export async function getCurvePoolBalance(chain: Chain, depositToken: string): Promise<CachedTokenBalance[]> {
  const cachedBalances = [];
  const registry = new ethers.Contract('0x90E00ACe148ca3b23Ac1bC8C240C2a7Dd9c2d7f5', curveRegistryAbi, chain.provider);
  const poolAddress = await registry.get_pool_from_lp_token(depositToken);
  let pool = new ethers.Contract(poolAddress, curvePoolAbi, chain.provider);

  let coin = 0;
  let hasTokens = true;
  let updatedAbi = false;
  while (hasTokens) {
    try {
      const tokenAddress = await pool.coins(coin);
      const token = getToken(ethers.utils.getAddress(tokenAddress));
      const balance = (await pool.balances(coin)) / Math.pow(10, token.decimals);
      cachedBalances.push(await toCachedBalance(token, balance));
      coin++;
    } catch (err) {
      if (!updatedAbi) {
        pool = new ethers.Contract(poolAddress, oldCurvePoolAbi, chain.provider);
        updatedAbi = true;
      } else {
        hasTokens = false;
      }
    }
  }

  return cachedBalances;
}

export async function getCurveSettTokenBalance(token: string): Promise<CachedLiquidityPoolTokenBalance> {
  const definition = ethSetts.find((sett) => sett.settToken === token);
  if (!definition || !definition.protocol) {
    throw new UnprocessableEntity('Cannot get curve sett token balances, requires a sett definition');
  }
  const chain = new Ethereum();
  const depositToken = getToken(definition.depositToken);
  const cachedTokens = await getCurvePoolBalance(chain, definition.depositToken);
  const contract = new ethers.Contract(depositToken.address, erc20Abi, chain.provider);
  const sett = await getCachedSett(definition);
  const totalSupply = parseFloat(ethers.utils.formatEther(await contract.totalSupply()));
  const scalar = sett.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.valueUsd *= scalar;
    cachedToken.valueEth *= scalar;
  });
  return tokenBalancesToCachedLiquidityPoolTokenBalance(definition.settToken, definition.protocol, cachedTokens);
}
