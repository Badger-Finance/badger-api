import { UnprocessableEntity } from '@tsed/exceptions';
// import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { ONE_YEAR_MS } from '../../config/constants';
import { TOKENS } from '../../config/tokens.config';
import { Mhbtc__factory } from '../../contracts';
import { Imbtc__factory } from '../../contracts/factories/Imbtc__factory';
import { MstableVault__factory } from '../../contracts/factories/MstableVault__factory';
import { valueSourceToCachedValueSource } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
// import { SourceType } from '../../rewards/enums/source-type.enum';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
// import { mStableApiResponse } from '../../tokens/interfaces/mbstable-api-response.interface';
import { Token } from '../../tokens/interfaces/token.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { formatBalance, getToken } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource } from '../interfaces/value-source.interface';
import { tokenEmission } from '../protocols.utils';

// const MSTABLE_API_URL = 'https://api.mstable.org/';
// const MSTABLE_BTC_APR = `${MSTABLE_API_URL}/massets/mbtc`;
const MSTABLE_MBTC_VAULT = '0xF38522f63f40f9Dd81aBAfD2B8EFc2EC958a3016';
const MSTABLE_HMBTC_VAULT = '0xF65D53AA6e2E4A5f4F026e73cb3e22C22D75E35C';

export class mStableStrategy {
  static async getValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    switch (settDefinition.depositToken) {
      case TOKENS.MHBTC:
        return Promise.all([getVaultSource(chain, settDefinition, MSTABLE_HMBTC_VAULT)]);
      case TOKENS.IMBTC:
      default:
        return getImBtcValuceSource(chain, settDefinition);
    }
  }
}

export async function getImBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const imbtc = Imbtc__factory.connect(token.address, chain.provider);
  const [exchangeRate, mbtcPrice] = await Promise.all([imbtc.exchangeRate(), getPrice(TOKENS.MBTC)]);
  const exchangeRateScalar = formatBalance(exchangeRate);
  return {
    name: token.name,
    address: token.address,
    usd: mbtcPrice.usd * exchangeRateScalar,
    eth: mbtcPrice.eth * exchangeRateScalar,
  };
}

export async function getMhBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const mhbtc = Mhbtc__factory.connect(token.address, chain.provider);
  const [mbtcPrice, mhbtcPrice, totalSupply] = await Promise.all([
    getPrice(TOKENS.MBTC),
    mhbtc.getPrice(),
    mhbtc.totalSupply(),
  ]);
  const mbtcBalance = formatBalance(mhbtcPrice.k);
  const mhbtcBalance = formatBalance(totalSupply);
  const exchangeRateScalar = mbtcBalance / mhbtcBalance;
  return {
    name: token.name,
    address: token.address,
    usd: mbtcPrice.usd * exchangeRateScalar,
    eth: mbtcPrice.eth * exchangeRateScalar,
  };
}

async function getImBtcValuceSource(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  // getMAssetValueSource(settDefinition),
  return Promise.all([getVaultSource(chain, settDefinition, MSTABLE_MBTC_VAULT)]);
}

async function getVaultSource(
  chain: Chain,
  settDefinition: SettDefinition,
  vaultAddress: string,
): Promise<CachedValueSource> {
  const vault = MstableVault__factory.connect(vaultAddress, chain.provider);
  if (!settDefinition.strategy) {
    throw new UnprocessableEntity(`${settDefinition.name} requires strategy`);
  }
  const address = settDefinition.strategy;
  const [unlocked, balance, unclaimedRewards, claimData, boost, depositTokenPrice, mtaPrice] = await Promise.all([
    vault.UNLOCK(),
    vault.rawBalanceOf(address),
    vault.unclaimedRewards(address),
    vault.userData(address),
    vault.getBoost(address),
    getPrice(settDefinition.depositToken),
    getPrice(TOKENS.MTA),
  ]);
  const unlockedMultiplier = formatBalance(unlocked);
  const vaultBalance = formatBalance(balance);
  const strategyBoost = formatBalance(boost);
  const now = Date.now();
  const lastClaim = new Date(claimData.lastAction.toNumber() * 1000).getTime();
  let valueSource = createValueSource('Vested MTA Rewards', uniformPerformance(0));
  if (lastClaim > 0) {
    const unclaimedAmount = formatBalance(unclaimedRewards.amount);
    const vaultAssets = vaultBalance * depositTokenPrice.usd;
    const unclaimedAssets = unclaimedAmount * mtaPrice.usd;
    const rewardScalar = ONE_YEAR_MS / (now - lastClaim);
    const vestingMultiplier = (1 - unlockedMultiplier) / unlockedMultiplier;
    const baseApr = ((unclaimedAssets * rewardScalar) / vaultAssets) * 100;
    const apr = baseApr * vestingMultiplier * strategyBoost;
    valueSource = createValueSource('Vested MTA Rewards', uniformPerformance(apr));
  }
  return valueSourceToCachedValueSource(valueSource, settDefinition, tokenEmission(getToken(TOKENS.MTA)));
}

// TODO: re-enable mstable api at some point
// async function getMAssetValueSource(settDefinition: SettDefinition): Promise<CachedValueSource> {
//   const sourceName = 'mBTC Native Yield';
//   const response = await fetch(MSTABLE_BTC_APR);
//   const performance = uniformPerformance(0);
//   if (!response.ok) {
//     return valueSourceToCachedValueSource(
//       createValueSource(sourceName, performance),
//       settDefinition,
//       SourceType.Emission,
//     );
//   }
//   const results: mStableApiResponse = await response.json();
//   const data = results.mbtc.metrics.historic.reverse().slice(0, 30);
//   let totalApy = 0;
//   for (let i = 0; i < data.length; i++) {
//     totalApy += data[i].dailyAPY;
//     const currentApy = totalApy / (i + 1);
//     if (i === 0) performance.oneDay = currentApy;
//     if (i === 2) performance.threeDay = currentApy;
//     if (i === 6) performance.sevenDay = currentApy;
//     if (i === 29) performance.thirtyDay = currentApy;
//   }
//   const valueSource = createValueSource(sourceName, performance);
//   return valueSourceToCachedValueSource(valueSource, settDefinition, SourceType.Emission);
// }
