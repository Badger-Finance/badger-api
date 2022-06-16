import { DataMapper } from '@aws/dynamodb-data-mapper';
import { UnprocessableEntity } from '@tsed/exceptions';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { getFullToken } from '../tokens/tokens.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getLpTokenBalances } from './indexer.utils';

export async function refreshVaultBalances() {
  await Promise.all(SUPPORTED_CHAINS.flatMap((c) => c.vaults.flatMap(async (v) => updateVaultTokenBalances(c, v))));
}

export async function updateVaultTokenBalances(chain: Chain, vaultDefinition: VaultDefinition): Promise<void> {
  try {
    const mapper = getDataMapper();
    const depositToken = await getFullToken(chain, vaultDefinition.depositToken);
    if (depositToken.type !== PricingType.UniV2LP && !vaultDefinition.getTokenBalance) {
      return;
    }
    if (depositToken.lpToken && vaultDefinition.getTokenBalance) {
      throw new UnprocessableEntity(`${vaultDefinition.name} cannot specify multiple token caching strategies!`);
    }
    if (depositToken.lpToken || depositToken.type === PricingType.UniV2LP) {
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

async function saveCachedTokenBalance(mapper: DataMapper, cachedTokenBalance: VaultTokenBalance): Promise<void> {
  try {
    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ err, cachedTokenBalance, tokens: cachedTokenBalance.tokenBalances });
  }
}
