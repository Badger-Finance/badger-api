import { Network } from '@badger-dao/sdk';
import { UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_SECONDS } from '../../config/constants';
import { ContractRegistry } from '../../config/interfaces/contract-registry.interface';
import { TOKENS } from '../../config/tokens.config';
import {
  CurveBaseRegistry__factory,
  CurvePool__factory,
  CurvePool3__factory,
  CurvePoolOld__factory,
  CurvePoolPolygon__factory,
  CurveRegistry__factory,
  CvxBooster__factory,
  CvxLocker__factory,
  CvxRewards__factory,
  Erc20__factory,
} from '../../contracts';
import {
  tokenBalancesToCachedLiquidityPoolTokenBalance,
  valueSourceToCachedValueSource,
} from '../../indexers/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { SourceType } from '../../rewards/enums/source-type.enum';
import { VaultDefinition } from '../../vaults/interfaces/vault-definition.interface';
import { getCachedSett, VAULT_SOURCE } from '../../vaults/vaults.utils';
import { CachedLiquidityPoolTokenBalance } from '../../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../../tokens/interfaces/cached-token-balance.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { formatBalance, getToken, toCachedBalance } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { PoolMap } from '../interfaces/pool-map.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';
import { request } from '../../etherscan/etherscan.utils';
import { CurveAPIResponse } from '../interfaces/curve-api-response.interrface';

/* Strategy Definitions */
export const cvxRewards = '0xCF50b810E57Ac33B91dCF525C6ddd9881B139332';
export const cvxCrvRewards = '0x3Fe65692bfCD0e6CF84cB1E7d24108E434A7587e';
export const threeCrvRewards = '0x7091dbb7fcbA54569eF1387Ac89Eb2a5C9F6d2EA';
export const cvxChef = '0xEF0881eC094552b2e128Cf945EF17a6752B4Ec5d';
export const cvxBooster = '0xF403C135812408BFbE8713b5A23a04b3D48AAE31';
export const crvBaseRegistry = '0x0000000022D53366457F9d5E68Ec105046FC4383';
export const cvxLocker = '0xd18140b4b819b895a3dba5442f959fa44994af50';

/* Protocol Constants */
export const CURVE_API_URL = 'https://stats.curve.fi/raw-stats/apys.json';
export const CURVE_CRYPTO_API_URL = 'https://stats.curve.fi/raw-stats-crypto/apys.json';
export const CURVE_MATIC_API_URL = 'https://stats.curve.fi/raw-stats-polygon/apys.json';
export const CURVE_ARBITRUM_API_URL = 'https://stats.curve.fi/raw-stats-arbitrum/apys.json';
export const CURVE_FACTORY_APY = 'https://api.curve.fi/api/getFactoryAPYs?version=2';

/* Protocol Definitions */
const curvePoolApr: Record<string, string> = {
  [TOKENS.CRV_RENBTC]: 'ren2',
  [TOKENS.CRV_SBTC]: 'rens',
  [TOKENS.CRV_TBTC]: 'tbtc',
  [TOKENS.CRV_HBTC]: 'hbtc',
  [TOKENS.CRV_PBTC]: 'pbtc',
  [TOKENS.CRV_OBTC]: 'obtc',
  [TOKENS.CRV_BBTC]: 'bbtc',
  [TOKENS.CRV_TRICRYPTO]: 'tricrypto',
  [TOKENS.CRV_TRICRYPTO2]: 'tricrypto2',
  [TOKENS.MATIC_CRV_TRICRYPTO]: 'atricrypto',
  [TOKENS.MATIC_CRV_AMWBTC]: 'ren',
  [TOKENS.ARB_CRV_TRICRYPTO]: 'tricrypto',
  [TOKENS.ARB_CRV_RENBTC]: 'ren',
};

const cvxPoolId: PoolMap = {
  [TOKENS.CRV_RENBTC]: 6,
  [TOKENS.CRV_SBTC]: 7,
  [TOKENS.CRV_TBTC]: 16,
  [TOKENS.CRV_HBTC]: 8,
  [TOKENS.CRV_PBTC]: 18,
  [TOKENS.CRV_BBTC]: 19,
  [TOKENS.CRV_OBTC]: 20,
  [TOKENS.CRV_TRICRYPTO]: 37,
  [TOKENS.CRV_TRICRYPTO2]: 38,
  [TOKENS.CRV_IBBTC]: 53,
};

const nonRegistryPools: ContractRegistry = {
  [TOKENS.MATIC_CRV_TRICRYPTO]: '0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36',
  [TOKENS.ARB_CRV_TRICRYPTO]: '0x960ea3e3C7FB317332d990873d354E18d7645590',
};

const discontinuedRewards = ['0x330416C863f2acCE7aF9C9314B422d24c672534a'].map((addr) => ethers.utils.getAddress(addr));

const convexWrap: Record<string, string> = {
  [TOKENS.CVXCRV]: TOKENS.BCVXCRV,
};

interface FactoryAPYResonse {
  data: {
    poolDetails: {
      apy: number;
      poolAddress: string;
    }[];
  };
}

export class ConvexStrategy {
  static async getValueSources(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
    switch (VaultDefinition.settToken) {
      case TOKENS.BCVX:
        return getCvxRewards(chain, VaultDefinition);
      case TOKENS.BCVXCRV:
        return getCvxCrvRewards(chain, VaultDefinition);
      case TOKENS.BICVX:
        return getLockedSources(chain, VaultDefinition);
      default:
        return getVaultSources(chain, VaultDefinition);
    }
  }
}

async function getLockedSources(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const locker = CvxLocker__factory.connect(cvxLocker, chain.provider);
  const cvxPrice = await getPrice(TOKENS.CVX);
  const cvxLocked = formatBalance(await locker.lockedSupply());
  const cvxValue = cvxPrice.usd * cvxLocked;

  let token = 0;
  const sources = [];
  while (true) {
    try {
      const reward = await locker.rewardTokens(token);
      let rewardToken = getToken(reward);
      const wrappedTokenAddress = convexWrap[rewardToken.address];
      if (wrappedTokenAddress) {
        rewardToken = getToken(wrappedTokenAddress);
      }
      const rewardAmount = await locker.getRewardForDuration(reward);
      const duration = await locker.rewardsDuration();
      const rewardTokenPrice = await getPrice(reward);
      const rewardScalar = ONE_YEAR_SECONDS / duration.toNumber();
      const rewardsValue = rewardTokenPrice.usd * formatBalance(rewardAmount) * rewardScalar;
      const rewardApr = (rewardsValue / cvxValue) * 100;
      const cvxValueSource = createValueSource(`${rewardToken.name} Rewards`, uniformPerformance(rewardApr));
      const cachedEmission = valueSourceToCachedValueSource(
        cvxValueSource,
        VaultDefinition,
        tokenEmission(rewardToken),
      );
      sources.push(cachedEmission);
      token++;
    } catch {
      break;
    }
  }

  return sources;
}

async function getVaultSources(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const booster = CvxBooster__factory.connect(cvxBooster, chain.provider);
  const poolInfo = await booster.poolInfo(cvxPoolId[VaultDefinition.depositToken]);
  const crv = CvxRewards__factory.connect(poolInfo.crvRewards, chain.provider);

  const crvToken = getToken(TOKENS.CRV);
  const cvxToken = getToken(TOKENS.CVX);

  // get prices
  const [cvxPrice, crvPrice, depositPrice] = await Promise.all([
    getPrice(cvxToken.address),
    getPrice(crvToken.address),
    getPrice(VaultDefinition.depositToken),
  ]);

  // get rewards
  const depositToken = getToken(VaultDefinition.depositToken);
  const crvReward = formatBalance(await crv.currentRewards(), crvToken.decimals);
  const cvxReward = await getCvxMint(chain, crvReward);
  const depositLocked = formatBalance(await crv.totalSupply(), depositToken.decimals);

  // get apr params
  const duration = (await crv.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;
  const poolValue = depositLocked * depositPrice.usd;
  const sett = await getCachedSett(VaultDefinition);
  // bps to percentage
  const fees = 100 - (sett.strategy.performanceFee + sett.strategy.strategistFee) / 100;

  // calculate CRV rewards
  const crvEmission = crvReward * crvPrice.usd * scalar;
  const crvUnderlyingApr = crvEmission / poolValue;
  const crvEmissionApr = (crvEmission / poolValue) * fees;

  // calculate CVX rewards
  const cvxEmission = cvxReward * cvxPrice.usd * scalar;
  const cvxUnderlyingApr = cvxEmission / poolValue;
  const cvxEmissionApr = (cvxEmission / poolValue) * fees;

  // emission tokens
  const bcvxCRV = getToken(TOKENS.BCVXCRV);
  const bveCVX = getToken(TOKENS.BICVX);

  // create value sources
  const totalUnderlyingApr = crvUnderlyingApr + cvxUnderlyingApr;
  const compoundValueSource = createValueSource(VAULT_SOURCE, uniformPerformance(totalUnderlyingApr), true);
  const crvValueSource = createValueSource(`${bcvxCRV.name} Rewards`, uniformPerformance(crvEmissionApr));
  const cvxValueSource = createValueSource(`${bveCVX.name} Rewards`, uniformPerformance(cvxEmissionApr));

  // create cached value sources
  const cachedCompounding = valueSourceToCachedValueSource(compoundValueSource, VaultDefinition, SourceType.Compound);
  const cachedCrvEmission = valueSourceToCachedValueSource(crvValueSource, VaultDefinition, tokenEmission(bcvxCRV));
  const cachedCvxEmission = valueSourceToCachedValueSource(cvxValueSource, VaultDefinition, tokenEmission(bveCVX));

  // calculate extra rewards value sources
  const extraRewardsLength = (await crv.extraRewardsLength()).toNumber();
  const cachedExtraSources: CachedValueSource[] = [];
  for (let i = 0; i < extraRewardsLength; i++) {
    const rewards = await crv.extraRewards(i);
    const virtualRewards = CvxRewards__factory.connect(rewards, chain.provider);
    const [cutoffTime, rewardAddress] = await Promise.all([
      virtualRewards.periodFinish(),
      virtualRewards.rewardToken(),
    ]);
    const expired = cutoffTime.toNumber() < Date.now() / 1000;
    if (expired || discontinuedRewards.includes(rewardAddress)) {
      continue;
    }
    let rewardToken = getToken(rewardAddress);
    if (rewardToken.address === TOKENS.CVX) {
      rewardToken = bveCVX;
    }
    const rewardTokenPrice = await getPrice(rewardToken.address);
    const rewardAmount = formatBalance(await virtualRewards.currentRewards(), rewardToken.decimals);
    const rewardEmission = rewardAmount * rewardTokenPrice.usd * scalar;
    const rewardApr = (rewardEmission / poolValue) * fees;
    const rewardSource = createValueSource(`${rewardToken.name} Rewards`, uniformPerformance(rewardApr));
    cachedExtraSources.push(valueSourceToCachedValueSource(rewardSource, VaultDefinition, tokenEmission(rewardToken)));
  }

  const cachedTradeFees = await getCurvePerformance(chain, VaultDefinition);
  return [cachedCompounding, cachedTradeFees, cachedCrvEmission, cachedCvxEmission, ...cachedExtraSources];
}

async function getCvxRewards(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  const cvx = CvxRewards__factory.connect(cvxRewards, chain.provider);

  // get prices
  const cvxPrice = await getPrice(TOKENS.CVX);
  const cvxToken = getToken(TOKENS.CVX);
  const cvxCrvPrice = await getPrice(TOKENS.CVXCRV);
  const cvxCrvToken = getToken(TOKENS.CVXCRV);

  // get rewards
  const cvxCrvReward = formatBalance(await cvx.currentRewards(), cvxCrvToken.decimals);
  const cvxLocked = formatBalance(await cvx.totalSupply(), cvxToken.decimals);

  // get apr params
  const duration = (await cvx.duration()).toNumber();
  const scalar = ONE_YEAR_SECONDS / duration;

  // calculate CVX rewards
  const emission = cvxCrvReward * cvxCrvPrice.usd * scalar;
  const poolValue = cvxLocked * cvxPrice.usd;
  const cvxCrvApr = (emission / poolValue) * 100;
  const valueSource = createValueSource(VAULT_SOURCE, uniformPerformance(cvxCrvApr), true);
  return [valueSourceToCachedValueSource(valueSource, VaultDefinition, SourceType.Compound)];
}

async function getCvxCrvRewards(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource[]> {
  // setup contracts
  const cvxCrv = CvxRewards__factory.connect(cvxCrvRewards, chain.provider);
  const threeCrv = CvxRewards__factory.connect(threeCrvRewards, chain.provider);

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
  const poolValue = cvxCrvLocked * cvxCrvPrice.usd;

  // calculate CVX rewards
  const cvxEmission = cvxReward * cvxPrice.usd * scalar;
  const cvxApr = (cvxEmission / poolValue) * 100;

  // calculate cvxCRV + 3CRV rewards
  const cvxCrvEmission = crvReward * crvPrice.usd * scalar;
  const cvxCrvApr = (cvxCrvEmission / poolValue) * 100;
  const threeCrvEmission = threeCrvReward * threeCrvPrice.usd * scalar;
  const threeCrvApr = (threeCrvEmission / poolValue) * 100;

  const totalApr = cvxCrvApr + threeCrvApr + cvxApr;
  const cvxCrvValueSource = createValueSource(VAULT_SOURCE, uniformPerformance(totalApr), true);
  return [valueSourceToCachedValueSource(cvxCrvValueSource, VaultDefinition, SourceType.Compound)];
}

export async function getCurvePerformance(chain: Chain, VaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  let defaultUrl;
  switch (chain.network) {
    case Network.Polygon:
      defaultUrl = CURVE_MATIC_API_URL;
      break;
    case Network.Arbitrum:
      defaultUrl = CURVE_ARBITRUM_API_URL;
      break;
    default:
      defaultUrl = CURVE_API_URL;
  }
  let curveData = await request<CurveAPIResponse>(defaultUrl);
  const assetKey = VaultDefinition.depositToken;
  const missingEntry = () => !curveData.apy.week[curvePoolApr[assetKey]];

  // try the secondary apy options, if not avilable give up
  if (missingEntry()) {
    curveData = await fetch(CURVE_CRYPTO_API_URL).then((response) => response.json());
  }

  let tradeFeePerformance = uniformPerformance(0);
  if (!missingEntry()) {
    tradeFeePerformance = {
      oneDay: curveData.apy.day[curvePoolApr[assetKey]] * 100,
      threeDay: curveData.apy.day[curvePoolApr[assetKey]] * 100,
      sevenDay: curveData.apy.week[curvePoolApr[assetKey]] * 100,
      thirtyDay: curveData.apy.month[curvePoolApr[assetKey]] * 100,
    };
  } else {
    const factoryAPY = await request<FactoryAPYResonse>(CURVE_FACTORY_APY);
    const poolDetails = factoryAPY.data.poolDetails.find(
      (pool) => ethers.utils.getAddress(pool.poolAddress) === VaultDefinition.depositToken,
    );
    if (poolDetails) {
      tradeFeePerformance = uniformPerformance(poolDetails.apy);
    }
  }

  const valueSource = createValueSource('Curve LP Fees', tradeFeePerformance);
  return valueSourceToCachedValueSource(valueSource, VaultDefinition, SourceType.TradeFee);
}

/* Adapted from https://docs.convexfinance.com/convexfinanceintegration/cvx-minting */

// constants
const cliffSize = 100000; // new cliff every 100,000 tokens
const cliffCount = 1000; // 1,000 cliffs
const maxSupply = 100000000; // 100 mil max supply

async function getCvxMint(chain: Chain, crvEarned: number): Promise<number> {
  const cvx = Erc20__factory.connect(TOKENS.CVX, chain.provider);

  // first get total supply
  const cvxTotalSupply = formatBalance(await cvx.totalSupply());

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
  const token = Erc20__factory.connect(depositToken, chain.provider);
  const poolValueUsd = poolBalance.reduce((total, balance) => (total += balance.valueUsd), 0);
  const poolValueEth = poolBalance.reduce((total, balance) => (total += balance.valueEth), 0);
  const totalSupply = await token.totalSupply();
  const supply = formatBalance(totalSupply, deposit.decimals);
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
  const baseRegistry = CurveBaseRegistry__factory.connect('0x0000000022D53366457F9d5E68Ec105046FC4383', chain.provider);
  const cachedBalances = [];
  const registryAddr = await baseRegistry.get_registry();
  let poolAddress;
  if (registryAddr !== ethers.constants.AddressZero) {
    const registry = CurveRegistry__factory.connect(registryAddr, chain.provider);
    poolAddress = await registry.get_pool_from_lp_token(depositToken);
  }
  // meta pools not in registry and no linkage - use a manually defined lookup
  if (!poolAddress || poolAddress === ethers.constants.AddressZero) {
    poolAddress = nonRegistryPools[depositToken] ?? depositToken;
  }
  if (!poolAddress) {
    throw new Error(`No pool found for ${depositToken} on ${chain.network}`);
  }
  const poolContracts = [
    CurvePool3__factory.connect(poolAddress, chain.provider),
    CurvePoolPolygon__factory.connect(poolAddress, chain.provider),
    CurvePool__factory.connect(poolAddress, chain.provider),
    CurvePoolOld__factory.connect(poolAddress, chain.provider),
  ];

  let option = 0;
  let coin = 0;
  while (true) {
    try {
      const pool = poolContracts[option];
      const tokenAddress = await pool.coins(coin);
      const token = getToken(ethers.utils.getAddress(tokenAddress));
      const balance = formatBalance(await pool.balances(coin), token.decimals);
      cachedBalances.push(await toCachedBalance(token, balance));
      coin++;
    } catch (err) {
      if (coin > 0) {
        break;
      }
      option++;
      if (option >= poolContracts.length) {
        break;
      }
    }
  }

  return cachedBalances;
}

export async function getCurveSettTokenBalance(chain: Chain, token: string): Promise<CachedLiquidityPoolTokenBalance> {
  const definition = chain.setts.find((sett) => sett.settToken === token);
  if (!definition || !definition.protocol) {
    throw new UnprocessableEntity('Cannot get curve sett token balances, requires a sett definition');
  }
  const depositToken = getToken(definition.depositToken);
  const cachedTokens = await getCurvePoolBalance(chain, definition.depositToken);
  const contract = Erc20__factory.connect(depositToken.address, chain.provider);
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
