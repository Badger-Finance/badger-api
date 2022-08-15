"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCurveStablePoolTokenPrice =
  exports.resolveCurvePoolTokenPrice =
  exports.getCurveVaultTokenBalance =
  exports.getCurvePoolBalance =
  exports.getCurveTokenPrice =
  exports.getCurvePerformance =
  exports.ConvexStrategy =
  exports.OLD_BRIBES_PROCESSOR =
  exports.BRIBES_PROCESSOR =
  exports.HARVEST_FORWARDER =
  exports.CURVE_BASE_REGISTRY =
  exports.CURVE_FACTORY_APY =
  exports.CURVE_ARBITRUM_API_URL =
  exports.CURVE_MATIC_API_URL =
  exports.CURVE_CRYPTO_API_URL =
  exports.CURVE_API_URL =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const vault_token_balance_model_1 = require("../../aws/models/vault-token-balance.model");
const request_1 = require("../../common/request");
const tokens_config_1 = require("../../config/tokens.config");
const contracts_1 = require("../../contracts");
const prices_utils_1 = require("../../prices/prices.utils");
const source_type_enum_1 = require("../../rewards/enums/source-type.enum");
const tokens_utils_1 = require("../../tokens/tokens.utils");
const vaults_utils_1 = require("../../vaults/vaults.utils");
const yields_utils_1 = require("../../vaults/yields.utils");
/* Protocol Constants */
exports.CURVE_API_URL = "https://stats.curve.fi/raw-stats/apys.json";
exports.CURVE_CRYPTO_API_URL = "https://stats.curve.fi/raw-stats-crypto/apys.json";
exports.CURVE_MATIC_API_URL = "https://stats.curve.fi/raw-stats-polygon/apys.json";
exports.CURVE_ARBITRUM_API_URL = "https://stats.curve.fi/raw-stats-arbitrum/apys.json";
exports.CURVE_FACTORY_APY = "https://api.curve.fi/api/getFactoryAPYs";
/* Protocol Contracts */
exports.CURVE_BASE_REGISTRY = "0x0000000022D53366457F9d5E68Ec105046FC4383";
exports.HARVEST_FORWARDER = "0xA84B663837D94ec41B0f99903f37e1d69af9Ed3E";
exports.BRIBES_PROCESSOR = "0xb2Bf1d48F2C2132913278672e6924efda3385de2";
exports.OLD_BRIBES_PROCESSOR = "0xbeD8f323456578981952e33bBfbE80D23289246B";
/* Protocol Definitions */
const curvePoolApr = {
  [tokens_config_1.TOKENS.CRV_RENBTC]: "ren2",
  [tokens_config_1.TOKENS.CRV_SBTC]: "rens",
  [tokens_config_1.TOKENS.CRV_TBTC]: "tbtc",
  [tokens_config_1.TOKENS.CRV_HBTC]: "hbtc",
  [tokens_config_1.TOKENS.CRV_PBTC]: "pbtc",
  [tokens_config_1.TOKENS.CRV_OBTC]: "obtc",
  [tokens_config_1.TOKENS.CRV_BBTC]: "bbtc",
  [tokens_config_1.TOKENS.CRV_TRICRYPTO]: "tricrypto",
  [tokens_config_1.TOKENS.CRV_TRICRYPTO2]: "tricrypto2",
  [tokens_config_1.TOKENS.MATIC_CRV_TRICRYPTO]: "atricrypto",
  [tokens_config_1.TOKENS.MATIC_CRV_AMWBTC]: "ren",
  [tokens_config_1.TOKENS.ARB_CRV_TRICRYPTO]: "tricrypto",
  [tokens_config_1.TOKENS.ARB_CRV_RENBTC]: "ren"
};
const nonRegistryPools = {
  [tokens_config_1.TOKENS.MATIC_CRV_TRICRYPTO]: "0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36",
  [tokens_config_1.TOKENS.ARB_CRV_TRICRYPTO]: "0x960ea3e3C7FB317332d990873d354E18d7645590",
  [tokens_config_1.TOKENS.CRV_TRICRYPTO2]: "0xD51a44d3FaE010294C616388b506AcdA1bfAAE46",
  [tokens_config_1.TOKENS.CRV_BADGER]: "0x50f3752289e1456BfA505afd37B241bca23e685d",
  [tokens_config_1.TOKENS.CTDL]: tokens_config_1.TOKENS.CRV_CTDL,
  [tokens_config_1.TOKENS.CVXFXS]: "0xd658A338613198204DCa1143Ac3F01A722b5d94A"
};
class ConvexStrategy {
  static async getValueSources(chain, vaultDefinition) {
    switch (vaultDefinition.address) {
      case tokens_config_1.TOKENS.BVECVX:
        return [];
      case tokens_config_1.TOKENS.BCRV_CVXBVECVX:
        return getLiquiditySources(chain, vaultDefinition);
      default:
        return Promise.all([getCurvePerformance(chain, vaultDefinition)]);
    }
  }
}
exports.ConvexStrategy = ConvexStrategy;
async function getLiquiditySources(chain, vaultDefinition) {
  const bveCVXVault = await chain.vaults.getVault(tokens_config_1.TOKENS.BVECVX);
  const [bveCVXLP, bveCVXSources] = await Promise.all([
    (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition),
    (0, vaults_utils_1.queryYieldSources)(bveCVXVault)
  ]);
  const vaultTokens = await (0, tokens_utils_1.getVaultTokens)(chain, bveCVXLP);
  const bveCVXValue = vaultTokens
    .filter((t) => t.address === tokens_config_1.TOKENS.BVECVX)
    .map((t) => t.value)
    .reduce((total, val) => (total += val), 0);
  const scalar = bveCVXValue / bveCVXLP.value;
  const lpSources = bveCVXSources.map((s) => {
    const { apr, minApr, maxApr, name, type } = s;
    const scaledApr = apr * scalar;
    const min = minApr / apr;
    const max = maxApr / apr;
    return (0, yields_utils_1.createYieldSource)(vaultDefinition, type, name, scaledApr, { min, max });
  });
  const cachedTradeFees = await getCurvePerformance(chain, vaultDefinition);
  return [cachedTradeFees, ...lpSources];
}
async function getCurvePerformance(chain, vaultDefinition) {
  let defaultUrl;
  switch (chain.network) {
    case sdk_1.Network.Polygon:
      defaultUrl = exports.CURVE_MATIC_API_URL;
      break;
    case sdk_1.Network.Arbitrum:
      defaultUrl = exports.CURVE_ARBITRUM_API_URL;
      break;
    default:
      defaultUrl = exports.CURVE_API_URL;
  }
  let curveData = await (0, request_1.request)(defaultUrl);
  const assetKey = vaultDefinition.depositToken;
  const missingEntry = () => !curveData.apy.week[curvePoolApr[assetKey]];
  // try the secondary apy options, if not avilable give up
  if (missingEntry()) {
    curveData = await (0, request_1.request)(exports.CURVE_CRYPTO_API_URL);
  }
  let tradeFeePerformance = 0;
  async function updateFactoryApy(version) {
    if (!missingEntry()) {
      tradeFeePerformance = curveData.apy.week[curvePoolApr[assetKey]] * 100;
    } else {
      const factoryAPY = await (0, request_1.request)(exports.CURVE_FACTORY_APY, { version });
      const poolDetails = factoryAPY.data.poolDetails.find(
        (pool) => ethers_1.ethers.utils.getAddress(pool.poolAddress) === vaultDefinition.depositToken
      );
      if (poolDetails) {
        tradeFeePerformance = poolDetails.apy;
      }
    }
  }
  await updateFactoryApy("2");
  if (tradeFeePerformance === 0) {
    await updateFactoryApy("crypto");
  }
  return (0, yields_utils_1.createYieldSource)(
    vaultDefinition,
    source_type_enum_1.SourceType.TradeFee,
    "Curve LP Fees",
    tradeFeePerformance
  );
}
exports.getCurvePerformance = getCurvePerformance;
async function getCurveTokenPrice(chain, depositToken) {
  const deposit = await (0, tokens_utils_1.getFullToken)(chain, depositToken);
  const poolBalance = await getCurvePoolBalance(chain, depositToken);
  const token = sdk_1.Erc20__factory.connect(depositToken, chain.provider);
  const value = poolBalance.reduce((total, balance) => (total += balance.value), 0);
  const totalSupply = await token.totalSupply();
  const supply = (0, sdk_1.formatBalance)(totalSupply, deposit.decimals);
  const price = value / supply;
  return {
    address: deposit.address,
    price
  };
}
exports.getCurveTokenPrice = getCurveTokenPrice;
async function getCurvePoolBalance(chain, depositToken) {
  var _a;
  const baseRegistry = contracts_1.CurveBaseRegistry__factory.connect(exports.CURVE_BASE_REGISTRY, chain.provider);
  const cachedBalances = [];
  const registryAddr = await baseRegistry.get_registry();
  let poolAddress;
  if (registryAddr !== ethers_1.ethers.constants.AddressZero) {
    const registry = contracts_1.CurveRegistry__factory.connect(registryAddr, chain.provider);
    poolAddress = await registry.get_pool_from_lp_token(depositToken);
  }
  // meta pools not in registry and no linkage - use a manually defined lookup
  if (!poolAddress || poolAddress === ethers_1.ethers.constants.AddressZero) {
    poolAddress = (_a = nonRegistryPools[depositToken]) !== null && _a !== void 0 ? _a : depositToken;
  }
  const poolContracts = [
    contracts_1.CurvePool3__factory.connect(poolAddress, chain.provider),
    contracts_1.CurvePool__factory.connect(poolAddress, chain.provider)
  ];
  let option = 0;
  let coin = 0;
  while (true) {
    try {
      const pool = poolContracts[option];
      const tokenAddress = await pool.coins(coin);
      const token = await (0, tokens_utils_1.getFullToken)(chain, ethers_1.ethers.utils.getAddress(tokenAddress));
      const balance = (0, sdk_1.formatBalance)(await pool.balances(coin), token.decimals);
      cachedBalances.push(await (0, tokens_utils_1.toBalance)(token, balance));
      coin++;
    } catch (err) {
      if (coin > 0) {
        break;
      }
      option++;
      if (option >= poolContracts.length) {
        break;
      }
    }
  }
  return cachedBalances;
}
exports.getCurvePoolBalance = getCurvePoolBalance;
async function getCurveVaultTokenBalance(chain, vaultDefinition) {
  const { depositToken, address } = vaultDefinition;
  const cachedTokens = await getCurvePoolBalance(chain, depositToken);
  const contract = sdk_1.Erc20__factory.connect(depositToken, chain.provider);
  const vault = await (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition);
  const totalSupply = parseFloat(ethers_1.ethers.utils.formatEther(await contract.totalSupply()));
  const scalar = vault.balance / totalSupply;
  cachedTokens.forEach((cachedToken) => {
    cachedToken.balance *= scalar;
    cachedToken.value *= scalar;
  });
  return Object.assign(new vault_token_balance_model_1.VaultTokenBalance(), {
    vault: address,
    tokenBalances: cachedTokens
  });
}
exports.getCurveVaultTokenBalance = getCurveVaultTokenBalance;
// this should really only be used on 50:50 curve v2 crypto pools
async function resolveCurvePoolTokenPrice(chain, token) {
  const balances = await getCurvePoolBalance(chain, nonRegistryPools[token.address]);
  if (balances.length != 2) {
    throw new Error("Pool has unexpected number of tokens!");
  }
  const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
  const requestToken = balances[requestTokenIndex];
  const pairToken = balances[1 - requestTokenIndex];
  const requestTokenPrice = pairToken.value / requestToken.balance;
  return {
    address: token.address,
    price: requestTokenPrice
  };
}
exports.resolveCurvePoolTokenPrice = resolveCurvePoolTokenPrice;
async function resolveCurveStablePoolTokenPrice(chain, token) {
  // TODO: figure out how to get this from the registry or crypto registry (?) properly
  const pool = nonRegistryPools[token.address];
  const balances = await getCurvePoolBalance(chain, pool);
  const sdk = await chain.getSdk();
  try {
    if (balances.length != 2) {
      throw new Error("Pool has unexpected number of tokens!");
    }
    // we can calculate "x" in terms of "y" - this is our token in terms of some known token
    const swapPool = contracts_1.CurvePool3__factory.connect(pool, sdk.provider);
    const requestTokenIndex = balances[0].address === token.address ? 0 : 1;
    const pairToken = balances[1 - requestTokenIndex];
    // token 0 in terms of token 1
    const tokenOutRatio = (0, sdk_1.formatBalance)(await swapPool.price_oracle());
    const scalar = requestTokenIndex === 0 ? 1 / tokenOutRatio : tokenOutRatio;
    const { price } = await (0, prices_utils_1.getPrice)(pairToken.address);
    const requestTokenPrice = scalar * price;
    return {
      address: token.address,
      price: requestTokenPrice
    };
  } catch (err) {
    console.error({ err, message: `Unable to price ${token.name}` });
  }
  return {
    address: token.address,
    price: 0
  };
}
exports.resolveCurveStablePoolTokenPrice = resolveCurveStablePoolTokenPrice;
//# sourceMappingURL=convex.strategy.js.map
