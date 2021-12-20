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
  await Promise.all(chains.flatMap((c) => c.setts.flatMap(async (s) => updateTokenBalance(c, s))));
}

export async function updateTokenBalance(chain: Chain, VaultDefinition: VaultDefinition): Promise<void> {
  try {
    const mapper = getDataMapper();
    const depositToken = getToken(VaultDefinition.depositToken);
    if (!depositToken.lpToken && !VaultDefinition.getTokenBalance) {
      return;
    }
    if (depositToken.lpToken && VaultDefinition.getTokenBalance) {
      throw new UnprocessableEntity(`${VaultDefinition.name} cannot specify multiple token caching strategies!`);
    }
    if (depositToken.lpToken) {
      const cachedLiquidityPoolTokenBalance = await getLpTokenBalances(chain, VaultDefinition);
      if (cachedLiquidityPoolTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedLiquidityPoolTokenBalance);
    }
    if (VaultDefinition.getTokenBalance) {
      const cachedTokenBalance = await VaultDefinition.getTokenBalance(chain, VaultDefinition.settToken);
      if (cachedTokenBalance.tokenBalances.length === 0) {
        return;
      }
      await saveCachedTokenBalance(mapper, cachedTokenBalance);
    }
  } catch (err) {
    console.error({ message: `Failed to index ${VaultDefinition.name} token balances`, err });
  }
}

async function saveCachedTokenBalance(
  mapper: DataMapper,
  cachedTokenBalance: CachedLiquidityPoolTokenBalance,
): Promise<void> {
  try {
    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ err, cachedTokenBalance });
  }
}
