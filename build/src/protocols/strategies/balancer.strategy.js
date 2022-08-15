"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBalancerSwapFees =
  exports.resolveBalancerPoolTokenPrice =
  exports.getBalancerVaultTokenBalance =
  exports.getBalancerPoolTokens =
  exports.getBPTPrice =
  exports.BalancerStrategy =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const graphql_request_1 = require("graphql-request");
const vault_token_balance_model_1 = require("../../aws/models/vault-token-balance.model");
const chain_config_1 = require("../../chains/config/chain.config");
const constants_1 = require("../../config/constants");
const contracts_1 = require("../../contracts");
const balancer_1 = require("../../graphql/generated/balancer");
const source_type_enum_1 = require("../../rewards/enums/source-type.enum");
const tokens_utils_1 = require("../../tokens/tokens.utils");
const vaults_utils_1 = require("../../vaults/vaults.utils");
const yields_utils_1 = require("../../vaults/yields.utils");
/* eslint-disable @typescript-eslint/no-non-null-assertion */
class BalancerStrategy {
  static async getValueSources(vault) {
    return getBalancerSwapFees(vault);
  }
}
exports.BalancerStrategy = BalancerStrategy;
async function getBPTPrice(chain, token) {
  let totalSupply;
  try {
    const maybePhantomPool = contracts_1.StablePhantomVault__factory.connect(token, chain.provider);
    // total supply never changes on a phantom pool, you must use virtual supply
    totalSupply = (0, sdk_1.formatBalance)(await maybePhantomPool.getVirtualSupply());
  } catch {
    const contract = sdk_1.Erc20__factory.connect(token, chain.provider);
    totalSupply = (0, sdk_1.formatBalance)(await contract.totalSupply());
  }
  const tokens = await getBalancerPoolTokens(chain, token);
  const value = tokens.map((t) => t.value).reduce((total, value) => (total += value), 0);
  return {
    address: token,
    price: value / totalSupply
  };
}
exports.getBPTPrice = getBPTPrice;
async function getBalancerPoolTokens(chain, token) {
  const sdk = await chain.getSdk();
  const maybePhantomPool = contracts_1.StablePhantomVault__factory.connect(token, sdk.provider);
  let bptIndex;
  try {
    const maybeBptIndex = await maybePhantomPool.getBptIndex();
    bptIndex = maybeBptIndex.toNumber();
  } catch {} // ignore the error - its not a phantom pool
  const pool = contracts_1.WeightedPool__factory.connect(token, sdk.provider);
  const [vault, poolId] = await Promise.all([pool.getVault(), pool.getPoolId()]);
  const vaultContract = contracts_1.BalancerVault__factory.connect(vault, sdk.provider);
  const poolTokens = await vaultContract.getPoolTokens(poolId);
  const tokens = [];
  for (let i = 0; i < poolTokens.balances.length; i++) {
    if (bptIndex && i === bptIndex) {
      continue;
    }
    const token = await (0, tokens_utils_1.getFullToken)(chain, poolTokens.tokens[i]);
    const balance = (0, sdk_1.formatBalance)(poolTokens.balances[i], token.decimals);
    const tokenBalance = await (0, tokens_utils_1.toBalance)(token, balance);
    tokens.push(tokenBalance);
  }
  return tokens;
}
exports.getBalancerPoolTokens = getBalancerPoolTokens;
async function getBalancerVaultTokenBalance(chain, token) {
  const vaultDefinition = await chain.vaults.getVault(token);
  const { depositToken, address } = vaultDefinition;
  const cachedTokens = await getBalancerPoolTokens(chain, depositToken);
  const sett = await (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition);
  let totalSupply;
  try {
    const maybePhantomPool = contracts_1.StablePhantomVault__factory.connect(depositToken, chain.provider);
    // total supply never changes on a phantom pool, you must use virtual supply
    totalSupply = (0, sdk_1.formatBalance)(await maybePhantomPool.getVirtualSupply());
  } catch {
    const contract = sdk_1.Erc20__factory.connect(depositToken, chain.provider);
    totalSupply = (0, sdk_1.formatBalance)(await contract.totalSupply());
  }
  const scalar = sett.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.value *= scalar;
  });
  const vaultTokenBalance = {
    vault: address,
    tokenBalances: cachedTokens
  };
  return Object.assign(new vault_token_balance_model_1.VaultTokenBalance(), vaultTokenBalance);
}
exports.getBalancerVaultTokenBalance = getBalancerVaultTokenBalance;
async function resolveBalancerPoolTokenPrice(chain, token, pool) {
  const balances = await getBalancerPoolTokens(chain, pool);
  const sdk = await chain.getSdk();
  const maybeWeightedPool = contracts_1.WeightedPool__factory.connect(pool, sdk.provider);
  try {
    const weights = await maybeWeightedPool.getNormalizedWeights();
    const targetIndex = balances.findIndex((b) => b.address === token.address);
    if (targetIndex < 0) {
      throw new Error(`${token.name} not found in target BPT (${pool})`);
    }
    const targetBalance = balances[targetIndex];
    const expectedWeight = (0, sdk_1.formatBalance)(weights[targetIndex]);
    const totalOtherValue = balances
      .filter((b) => b.address !== token.address)
      .reduce((total, balance) => (total += balance.value), 0);
    const multiplier = expectedWeight / (1 - expectedWeight);
    const tokenPrice = (totalOtherValue * multiplier) / targetBalance.balance;
    return {
      address: token.address,
      price: tokenPrice
    };
  } catch {
    // Attempt instead, to evaluate as a stable pool
    // We will assume stable pools, by nature, to have two assets - presuambly pegged
    try {
      if (balances.length != 2) {
        throw new Error("Pool has unexpected number of tokens!");
      }
      // we can calculate "x" in terms of "y" - this is our token in terms of some known token
      const probablyStablePool = contracts_1.StablePool__factory.connect(pool, sdk.provider);
      // derivation adapted from https://twitter.com/0xa9a/status/1514192791689179137
      const [amplificationParameter, lastInvariantData] = await Promise.all([
        probablyStablePool.getAmplificationParameter(),
        probablyStablePool.getLastInvariant()
      ]);
      const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
      const requestToken = balances[requestTokenIndex];
      const pairToken = balances[1 - requestTokenIndex];
      const amplificiation =
        4 * (amplificationParameter.value.toNumber() / amplificationParameter.precision.toNumber());
      const invariant = (0, sdk_1.formatBalance)(lastInvariantData.lastInvariant);
      // calculate scalar y/x
      const scalar = pairToken.balance / requestToken.balance;
      const divisor = Math.pow(invariant, 3);
      // calculate numerator
      const numeratorTop = 2 * amplificiation * Math.pow(requestToken.balance, 2) * pairToken.balance;
      const numerator = 1 + numeratorTop / divisor;
      // calculate denominator
      const denominatorTop = 2 * amplificiation * Math.pow(pairToken.balance, 2) * requestToken.balance;
      const denominator = 1 + denominatorTop / divisor;
      const resultScalar = scalar * (numerator / denominator);
      const requestTokenPrice = resultScalar * (pairToken.value / pairToken.balance);
      return {
        address: token.address,
        price: requestTokenPrice
      };
    } catch (err) {
      console.error({ err, message: `Unable to price ${token.name}` });
    }
  }
  return {
    address: token.address,
    price: 0
  };
}
exports.resolveBalancerPoolTokenPrice = resolveBalancerPoolTokenPrice;
async function getBalancerSwapFees(vault) {
  try {
    const chain = chain_config_1.Chain.getChain(sdk_1.Network.Ethereum);
    const client = new graphql_request_1.GraphQLClient(constants_1.BALANCER_URL);
    const sdk = (0, balancer_1.getSdk)(client);
    const pool = contracts_1.WeightedPool__factory.connect(vault.depositToken, chain.provider);
    const poolId = await pool.getPoolId();
    const { poolSnapshots } = await sdk.PoolSnapshots({
      first: 3,
      where: {
        pool: poolId.toLowerCase()
      },
      orderBy: balancer_1.PoolSnapshot_OrderBy.Timestamp,
      orderDirection: balancer_1.OrderDirection.Desc
    });
    if (poolSnapshots.length !== 3) {
      return [];
    }
    // retrieve previous day boundaries for pool snapshots
    const [_, previousPeriodEnd, previousPeriodStart] = poolSnapshots;
    // calcualte previous day swap fee difference
    const totalFees = Number(previousPeriodEnd.swapFees) - Number(previousPeriodStart.swapFees);
    const balancerFees = totalFees / 2;
    const poolFees = totalFees - balancerFees;
    // calculate swap fee apr based on full previous days fees
    const poolLiquidity = Number(previousPeriodEnd.liquidity);
    const yearlyFees = poolFees * 365;
    const yearlyApr = (yearlyFees / poolLiquidity) * 100;
    return [
      (0, yields_utils_1.createYieldSource)(
        vault,
        source_type_enum_1.SourceType.TradeFee,
        "Balancer LP Fees",
        yearlyApr
      )
    ];
  } catch {
    // some of the aura vaults are not pools - they will error (auraBal, graviAura)
    return [];
  }
}
exports.getBalancerSwapFees = getBalancerSwapFees;
//# sourceMappingURL=balancer.strategy.js.map
