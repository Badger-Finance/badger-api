import { DataMapper } from '@aws/dynamodb-data-mapper';
import { UnprocessableEntity } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { UniV2PairFragment } from '../graphql/generated/uniswap';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokensService } from '../tokens/tokens.service';
import { getToken } from '../tokens/tokens.utils';
import { settToCachedSnapshot, tokenBalancesToCachedLiquidityPoolTokenBalance } from './indexer.utils';

export async function refreshTokenBalances() {
  const chains = loadChains();

  for (const chain of chains) {
    const settDefinitions = chain.setts;
    for (const settDefinition of settDefinitions) {
      const depositToken = getToken(settDefinition.depositToken);
      if (!depositToken.lpToken && !settDefinition.getTokenBalance) {
        continue;
      }
      if (depositToken.lpToken && settDefinition.getTokenBalance) {
        throw new UnprocessableEntity(`${settDefinition.name} cannot specify multiple token caching strategies!`);
      }

      const mapper = getDataMapper();
      try {
        if (depositToken.lpToken) {
          const cachedLiquidityPoolTokenBalance = await getLpTokenBalances(chain, settDefinition);
          await saveCachedTokenBalance(mapper, cachedLiquidityPoolTokenBalance);
        }
        if (settDefinition.getTokenBalance) {
          const cachedTokenBalance = await settDefinition.getTokenBalance();
          await saveCachedTokenBalance(mapper, cachedTokenBalance);
        }
      } catch (err) {
        console.log({ message: `Failed to index ${settDefinition.name} token balances`, err });
      }
    }
  }
}

async function saveCachedTokenBalance(
  mapper: DataMapper,
  cachedTokenBalance: CachedLiquidityPoolTokenBalance,
): Promise<void> {
  try {
    mapper.put(cachedTokenBalance);
  } catch (err) {
    console.log({ message: err.message, cachedTokenBalance });
  }
}

async function getLpTokenBalances(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedLiquidityPoolTokenBalance> {
  const poolData = await TokensService.getPoolData(settDefinition);
  if (!poolData) {
    throw new UnprocessableEntity(`${settDefinition.name} liquidity pool data unavailable`);
  }
  const pairId = settDefinition.depositToken.toLowerCase();
  const settSnapshot = await settToCachedSnapshot(chain, settDefinition);
  const { balance } = settSnapshot;
  const { protocol } = settDefinition;
  const { pair } = poolData;
  if (!pair || !protocol) {
    throw new UnprocessableEntity(`${settDefinition.name} pair / protocol data unavailable`);
  }
  return tokenBalancesToCachedLiquidityPoolTokenBalance(
    pairId,
    protocol,
    await pairToCachedTokenBalance(pair, balance),
  );
}

async function tokenPriceInCurrency(tokenPrice: TokenPrice, balance: number, currency: string): Promise<number> {
  return inCurrency(tokenPrice, currency) * balance;
}

async function pairToCachedTokenBalance(pair: UniV2PairFragment, balance: number): Promise<CachedTokenBalance[]> {
  const valueScalar = pair.totalSupply > 0 ? balance / pair.totalSupply : 0;
  const token0Price = await getPrice(pair.token0.id);
  const token1Price = await getPrice(pair.token1.id);
  const token0Balance = pair.reserve0 * valueScalar;
  const token1Balance = pair.reserve1 * valueScalar;
  const token0: CachedTokenBalance = {
    name: pair.token0.name,
    address: pair.token0.id,
    symbol: pair.token0.symbol,
    decimals: pair.token0.decimals,
    balance: token0Balance,
    valueEth: await tokenPriceInCurrency(token0Price, token0Balance, 'eth'),
    valueUsd: await tokenPriceInCurrency(token0Price, token0Balance, 'usd'),
  };
  const token1: CachedTokenBalance = {
    name: pair.token1.name,
    address: pair.token1.id,
    symbol: pair.token1.symbol,
    decimals: pair.token1.decimals,
    balance: token1Balance,
    valueEth: await tokenPriceInCurrency(token1Price, token1Balance, 'eth'),
    valueUsd: await tokenPriceInCurrency(token1Price, token1Balance, 'usd'),
  };
  return [token0, token1];
}
