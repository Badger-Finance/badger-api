import { Protocol } from '@badger-dao/sdk';

import { getDataMapper } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { SUPPORTED_CHAINS } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { getBalancerVaultTokenBalance } from '../protocols/strategies/balancer.strategy';
import { getCurveVaultTokenBalance } from '../protocols/strategies/convex.strategy';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { getCachedVault } from '../vaults/vaults.utils';
import { getLpTokenBalances } from './indexer.utils';

export async function refreshVaultBalances() {
  await Promise.all(
    SUPPORTED_CHAINS.flatMap(async (c) => {
      const vaults = await c.vaults.all();
      return vaults.map(async (v) => updateVaultTokenBalances(c, v));
    }),
  );
  return 'done';
}

export async function updateVaultTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<void> {
  try {
    const mapper = getDataMapper();
    const [depositToken, cachedVault] = await Promise.all([
      getFullToken(chain, vault.depositToken),
      getCachedVault(chain, vault),
    ]);

    let cachedTokenBalance: VaultTokenBalance | undefined;

    switch (vault.protocol) {
      case Protocol.Solidex:
      case Protocol.OxDAO:
      case Protocol.Swapr:
      case Protocol.Spookyswap:
      case Protocol.Quickswap:
      case Protocol.Solidly:
      case Protocol.Sushiswap:
      case Protocol.Uniswap:
        cachedTokenBalance = await getLpTokenBalances(chain, vault);
        break;
      case Protocol.Convex:
      case Protocol.Curve:
        cachedTokenBalance = await getCurveVaultTokenBalance(chain, vault.address);
        break;
      case Protocol.Aura:
      case Protocol.Balancer:
        cachedTokenBalance = await getBalancerVaultTokenBalance(chain, vault.address);
        break;
      default:
        cachedTokenBalance = Object.assign(new VaultTokenBalance(), {
          vault: vault.address,
          tokenBalances: [await toBalance(depositToken, cachedVault.balance)],
        });
        break;
    }

    if (cachedTokenBalance) {
      await mapper.put(cachedTokenBalance);
    }
  } catch (err) {
    console.error({ message: `Failed to index ${vault.name} token balances`, err });
  }
}
