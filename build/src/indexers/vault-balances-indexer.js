"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVaultTokenBalances = exports.refreshVaultBalances = void 0;
const sdk_1 = require("@badger-dao/sdk");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const vault_token_balance_model_1 = require("../aws/models/vault-token-balance.model");
const chain_1 = require("../chains/chain");
const balancer_strategy_1 = require("../protocols/strategies/balancer.strategy");
const convex_strategy_1 = require("../protocols/strategies/convex.strategy");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_utils_1 = require("../vaults/vaults.utils");
const indexer_utils_1 = require("./indexer.utils");
async function refreshVaultBalances() {
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    const vaults = await chain.vaults.all();
    await Promise.all(vaults.map(async (v) => updateVaultTokenBalances(chain, v)));
  }
  return "done";
}
exports.refreshVaultBalances = refreshVaultBalances;
async function updateVaultTokenBalances(chain, vault) {
  try {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    const [depositToken, cachedVault] = await Promise.all([
      (0, tokens_utils_1.getFullToken)(chain, vault.depositToken),
      (0, vaults_utils_1.getCachedVault)(chain, vault)
    ]);
    let cachedTokenBalance;
    try {
      switch (vault.protocol) {
        case sdk_1.Protocol.Solidex:
        case sdk_1.Protocol.OxDAO:
        case sdk_1.Protocol.Swapr:
        case sdk_1.Protocol.Spookyswap:
        case sdk_1.Protocol.Quickswap:
        case sdk_1.Protocol.Solidly:
        case sdk_1.Protocol.Sushiswap:
        case sdk_1.Protocol.Uniswap:
          cachedTokenBalance = await (0, indexer_utils_1.getLpTokenBalances)(chain, vault);
          break;
        case sdk_1.Protocol.Convex:
        case sdk_1.Protocol.Curve:
          cachedTokenBalance = await (0, convex_strategy_1.getCurveVaultTokenBalance)(chain, vault);
          break;
        case sdk_1.Protocol.Aura:
        case sdk_1.Protocol.Balancer:
          cachedTokenBalance = await (0, balancer_strategy_1.getBalancerVaultTokenBalance)(chain, vault.address);
          break;
        default:
          break;
      }
    } catch (err) {
      console.warn({ message: `${vault.name} failed to create protocol based token balance`, err });
    }
    if (!cachedTokenBalance || cachedTokenBalance.tokenBalances.length === 0) {
      cachedTokenBalance = Object.assign(new vault_token_balance_model_1.VaultTokenBalance(), {
        vault: vault.address,
        tokenBalances: [await (0, tokens_utils_1.toBalance)(depositToken, cachedVault.balance)]
      });
    }
    await mapper.put(cachedTokenBalance);
  } catch (err) {
    console.error({ message: `Failed to index ${vault.name} token balances`, err });
  }
}
exports.updateVaultTokenBalances = updateVaultTokenBalances;
//# sourceMappingURL=vault-balances-indexer.js.map
