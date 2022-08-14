import { Protocol } from "@badger-dao/sdk";

import { getDataMapper } from "../aws/dynamodb.utils";
import { VaultDefinitionModel } from "../aws/models/vault-definition.model";
import { VaultTokenBalance } from "../aws/models/vault-token-balance.model";
import { SUPPORTED_CHAINS } from "../chains/chain";
import { Chain } from "../chains/config/chain.config";
import { getBalancerVaultTokenBalance } from "../protocols/strategies/balancer.strategy";
import { getCurveVaultTokenBalance } from "../protocols/strategies/convex.strategy";
import { getFullToken, toBalance } from "../tokens/tokens.utils";
import { getCachedVault } from "../vaults/vaults.utils";
import { getLpTokenBalances } from "./indexer.utils";

export async function refreshVaultBalances() {
  for (const chain of SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(vaults.map(async (v) => updateVaultTokenBalances(chain, v)));
  }
  return "done";
}

export async function updateVaultTokenBalances(chain: Chain, vault: VaultDefinitionModel): Promise<void> {
  try {
    const mapper = getDataMapper();
    const [depositToken, cachedVault] = await Promise.all([getFullToken(chain, vault.depositToken), getCachedVault(chain, vault)]);

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
          cachedTokenBalance = await getLpTokenBalances(chain, vault);
          break;
        case Protocol.Convex:
        case Protocol.Curve:
          cachedTokenBalance = await getCurveVaultTokenBalance(chain, vault);
          break;
        case Protocol.Aura:
        case Protocol.Balancer:
          cachedTokenBalance = await getBalancerVaultTokenBalance(chain, vault.address);
          break;
        default:
          break;
      }
    } catch (err) {
      console.warn({ message: `${vault.name} failed to create protocol based token balance`, err });
    }

    if (!cachedTokenBalance || cachedTokenBalance.tokenBalances.length === 0) {
      cachedTokenBalance = Object.assign(new VaultTokenBalance(), {
        vault: vault.address,
        tokenBalances: [await toBalance(depositToken, cachedVault.balance)]
      });
    }

    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ message: `Failed to index ${vault.name} token balances`, err });
  }
}
