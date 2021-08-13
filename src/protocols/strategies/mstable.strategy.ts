import fetch from 'node-fetch';
import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { Mhbtc__factory } from '../../contracts';
import { Imbtc__factory } from '../../contracts/factories/Imbtc__factory';
import { getPrice } from '../../prices/prices.utils';
import { SettDefinition } from '../../setts/interfaces/sett-definition.interface';
import { mStableApiResponse } from '../../tokens/interfaces/mbstable-api-response.interface';
import { Token } from '../../tokens/interfaces/token.interface';
import { TokenPrice } from '../../tokens/interfaces/token-price.interface';
import { formatBalance } from '../../tokens/tokens.utils';
import { CachedValueSource } from '../interfaces/cached-value-source.interface';
import { uniformPerformance } from '../interfaces/performance.interface';
import { createValueSource, ValueSource } from '../interfaces/value-source.interface';

const MSTABLE_API_URL = 'https://api.mstable.org/';
const MSTABLE_BTC_APR = `${MSTABLE_API_URL}/massets/mbtc`;

export class mStableStrategy {
  static async getValueSources(_chain: Chain, _settDefinition: SettDefinition): Promise<CachedValueSource[]> {
    const nativeSource = await getMAssetValuSource();
    console.log(nativeSource);
    return [];
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

async function getMAssetValuSource(): Promise<ValueSource> {
  const sourceName = 'mBTC Native Yield';
  const response = await fetch(MSTABLE_BTC_APR);
  const performance = uniformPerformance(0);
  if (!response.ok) {
    return createValueSource(sourceName, performance);
  }
  const results: mStableApiResponse = await response.json();
  const data = results.mbtc.metrics.historic;
  let totalApy = 0;
  for (let i = 0; i < data.length; i++) {
    totalApy += data[i].dailyAPY;
    const currentApy = totalApy / (i + 1);
    if (i === 0) performance.oneDay = currentApy;
    if (i === 2) performance.threeDay = currentApy;
    if (i === 6) performance.sevenDay = currentApy;
    if (i === 29) performance.thirtyDay = currentApy;
  }
  return createValueSource(sourceName, performance);
}
