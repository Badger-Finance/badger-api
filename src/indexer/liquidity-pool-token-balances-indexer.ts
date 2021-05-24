import { getDataMapper } from '../aws/dynamodb.utils';
import { bscSetts } from '../chains/config/bsc.config';
import { ethSetts } from '../chains/config/eth.config';
import { UniV2PairFragment } from '../graphql/generated/uniswap';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { getCachedSett } from '../setts/setts.utils';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokensService } from '../tokens/tokens.service';
import { tokenBalancesToCachedLiquidityPoolTokenBalance } from './indexer.utils';

export async function refreshLpTokenBalances() {
  const settDefinitions = [...bscSetts, ...ethSetts];

  for (const settDefinition of settDefinitions) {
    const poolData = await TokensService.getPoolData(settDefinition);
    // Silently skip any missing data
    if (!poolData) {
      continue;
    }

    const mapper = getDataMapper();
    let cachedLiquidityPoolTokenBalance;
    try {
      const pairId = settDefinition.depositToken.toLowerCase();
      const sett = await getCachedSett(settDefinition);
      const { balance } = sett;
      const { protocol } = settDefinition;
      const { pair } = poolData;
      if (!pair || !protocol) {
        continue;
      }

      cachedLiquidityPoolTokenBalance = tokenBalancesToCachedLiquidityPoolTokenBalance(
        pairId,
        protocol,
        await pairToCachedTokenBalance(pair, balance),
      );
      await mapper.put(cachedLiquidityPoolTokenBalance);
    } catch (err) {
      console.log({ message: err.message, cachedLiquidityPoolTokenBalance });
    }
  }
}

async function tokenPriceInCurrency(tokenPrice: TokenPrice, balance: number, currency: string): Promise<number> {
  return inCurrency(tokenPrice, currency) * balance;
}

async function pairToCachedTokenBalance(pair: UniV2PairFragment, balance: number): Promise<CachedTokenBalance[]> {
  const valueScalar = pair.totalSupply > 0 ? balance / pair.totalSupply : 0;
  const token0Price = await getPrice(pair.token0.id);
  const token1Price = await getPrice(pair.token1.id);
  const token0: CachedTokenBalance = {
    name: pair.token0.name,
    address: pair.token0.id,
    symbol: pair.token0.symbol,
    decimals: pair.token0.decimals,
    balance: pair.reserve0 * valueScalar,
    valueEth: await tokenPriceInCurrency(token0Price, balance, 'eth'),
    valueUsd: await tokenPriceInCurrency(token0Price, balance, 'usd'),
  };
  const token1: CachedTokenBalance = {
    name: pair.token1.name,
    address: pair.token1.id,
    symbol: pair.token1.symbol,
    decimals: pair.token1.decimals,
    balance: pair.reserve1 * valueScalar,
    valueEth: await tokenPriceInCurrency(token1Price, balance, 'eth'),
    valueUsd: await tokenPriceInCurrency(token1Price, balance, 'usd'),
  };
  return [token0, token1];
}
