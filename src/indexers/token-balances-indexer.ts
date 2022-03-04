import { DataMapper } from '@aws/dynamodb-data-mapper';
import { UnprocessableEntity } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { getToken } from '../tokens/tokens.utils';
import { getLpTokenBalances } from './indexer.utils';

export async function refreshTokenBalances() {
  const chains = loadChains();
  await Promise.all(chains.flatMap((c) => c.vaults.flatMap(async (v) => updateTokenBalance(c, v))));
}

export async function updateTokenBalance(chain: Chain, vaultDefinition: VaultDefinition): Promise<void> {
  try {
    const mapper = getDataMapper();
    const depositToken = getToken(vaultDefinition.depositToken);
    if (!depositToken.lpToken && !vaultDefinition.getTokenBalance) {
      return;
    }
    if (depositToken.lpToken && vaultDefinition.getTokenBalance) {
      throw new UnprocessableEntity(`${vaultDefinition.name} cannot specify multiple token caching strategies!`);
    }
    if (depositToken.lpToken) {
      const cachedLiquidityPoolTokenBalance = await getLpTokenBalances(chain, vaultDefinition);
      if (cachedLiquidityPoolTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedLiquidityPoolTokenBalance);
    }
    if (vaultDefinition.getTokenBalance) {
      const cachedTokenBalance = await vaultDefinition.getTokenBalance(chain, vaultDefinition.vaultToken);
      if (cachedTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedTokenBalance);
    }
  } catch (err) {
    console.error({ message: `Failed to index ${vaultDefinition.name} token balances`, err });
  }
}

async function saveCachedTokenBalance(
  mapper: DataMapper,
  cachedTokenBalance: CachedLiquidityPoolTokenBalance,
): Promise<void> {
  try {
    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ err, cachedTokenBalance, tokens: cachedTokenBalance.tokenBalances });
  }
}
