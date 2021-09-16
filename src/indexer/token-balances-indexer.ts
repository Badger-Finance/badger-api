import { DataMapper } from '@aws/dynamodb-data-mapper';
import { BadRequest, NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { getToken, toCachedBalance } from '../tokens/tokens.utils';
import { settToCachedSnapshot, tokenBalancesToCachedLiquidityPoolTokenBalance } from './indexer.utils';

export async function refreshTokenBalances() {
  const chains = loadChains();
  await Promise.all(chains.flatMap((c) => c.setts.flatMap(async (s) => updateTokenBalance(c, s))));
}

async function updateTokenBalance(chain: Chain, settDefinition: SettDefinition): Promise<void> {
  try {
    const mapper = getDataMapper();
    const depositToken = getToken(settDefinition.depositToken);
    if (!depositToken.lpToken && !settDefinition.getTokenBalance) {
      return;
    }
    if (depositToken.lpToken && settDefinition.getTokenBalance) {
      throw new UnprocessableEntity(`${settDefinition.name} cannot specify multiple token caching strategies!`);
    }
    if (depositToken.lpToken) {
      const cachedLiquidityPoolTokenBalance = await getLpTokenBalances(chain, settDefinition);
      if (cachedLiquidityPoolTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedLiquidityPoolTokenBalance);
    }
    if (settDefinition.getTokenBalance) {
      const cachedTokenBalance = await settDefinition.getTokenBalance(chain, settDefinition.settToken);
      if (cachedTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedTokenBalance);
    }
  } catch (err) {
    console.error({ message: `Failed to index ${settDefinition.name} token balances`, err });
  }
}

async function saveCachedTokenBalance(
  mapper: DataMapper,
  cachedTokenBalance: CachedLiquidityPoolTokenBalance,
): Promise<void> {
  try {
    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ message: err.message, cachedTokenBalance });
  }
}

async function getLpTokenBalances(chain: Chain, sett: SettDefinition): Promise<CachedLiquidityPoolTokenBalance> {
  try {
    if (!sett.protocol) {
      throw new BadRequest('LP balance look up requires a defined protocol');
    }
    const liquidityData = await getLiquidityData(chain, sett.depositToken);
    const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    const t0Token = getToken(token0);
    const t1Token = getToken(token1);

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const settSnapshot = await settToCachedSnapshot(chain, sett);
    const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
    const t0TokenBalance = reserve0 * valueScalar;
    const t1TokenBalance = reserve1 * valueScalar;
    const tokenBalances = await Promise.all([
      toCachedBalance(t0Token, t0TokenBalance),
      toCachedBalance(t1Token, t1TokenBalance),
    ]);

    return tokenBalancesToCachedLiquidityPoolTokenBalance(sett.depositToken, sett.protocol, tokenBalances);
  } catch (err) {
    throw new NotFound(`${sett.protocol} pool pair ${sett.depositToken} does not exist`);
  }
}
