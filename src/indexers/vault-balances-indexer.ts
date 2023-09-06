import { Network, Protocol } from '@badger-dao/sdk';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { VaultDefinitionModel } from '../aws/models/vault-definition.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { getBalancerVaultTokenBalance } from '../protocols/strategies/balancer.strategy';
import { getCurveVaultTokenBalance } from '../protocols/strategies/convex.strategy';
import { getLpTokenBalances } from '../protocols/strategies/uniswap.strategy';
import { getFullToken, toBalance } from '../tokens/tokens.utils';
import { rfw } from '../utils/retry.utils';
import { getCachedVault } from '../vaults/vaults.utils';

export async function refreshVaultBalances() {
  for (const chain of getSupportedChains([Network.Ethereum])) {
    const vaults = await chain.vaults.all();
    await Promise.all(vaults.map(async (v) => updateVaultTokenBalances(chain, v)));
  }
  return 'done';
}

async function updateVaultTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<void> {
  try {
    const mapper = getDataMapper();
    let cachedTokenBalance: VaultTokenBalance | undefined;

    try {
      switch (vault.protocol) {
        case Protocol.Solidex:
        case Protocol.OxDAO:
        case Protocol.Swapr:
        case Protocol.Spookyswap:
        case Protocol.Quickswap:
        case Protocol.Solidly:
        case Protocol.Sushiswap:
        case Protocol.Uniswap:
          cachedTokenBalance = await rfw(getLpTokenBalances)(chain, vault);
          break;
        case Protocol.Convex:
        case Protocol.Curve:
          cachedTokenBalance = await rfw(getCurveVaultTokenBalance)(chain, vault);
          break;
        case Protocol.Aura:
        case Protocol.Balancer:
          cachedTokenBalance = await rfw(getBalancerVaultTokenBalance)(chain, vault.address);
          break;
        default:
          break;
      }
    } catch (err) {
      console.warn({ message: `${vault.name} failed to create protocol based token balance`, err });
    }

    if (!cachedTokenBalance || cachedTokenBalance.tokenBalances.length === 0) {
      const [depositToken, cachedVault] = await Promise.all([
        getFullToken(chain, vault.depositToken),
        getCachedVault(chain, vault),
      ]);
      const singleTokenBalance: VaultTokenBalance = {
        id: getVaultEntityId(chain, vault),
        chain: chain.network,
        vault: vault.address,
        tokenBalances: [await rfw(toBalance)(depositToken, cachedVault.balance)],
      };
      cachedTokenBalance = Object.assign(new VaultTokenBalance(), singleTokenBalance);
    }

    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ message: `Failed to index ${vault.name} token balances`, err });
  }
}
