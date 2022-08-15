"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccountVaultBalances =
  exports.getLatestMetadata =
  exports.getClaimableBalanceSnapshot =
  exports.getCachedAccount =
  exports.getCachedBoost =
  exports.toVaultBalance =
  exports.queryCachedAccount =
  exports.getAccounts =
  exports.getBoostFile =
    void 0;
const sdk_1 = require("@badger-dao/sdk");
const ethers_1 = require("ethers");
const dynamodb_utils_1 = require("../aws/dynamodb.utils");
const cached_account_model_1 = require("../aws/models/cached-account.model");
const cached_boost_model_1 = require("../aws/models/cached-boost.model");
const user_claim_snapshot_model_1 = require("../aws/models/user-claim-snapshot.model");
const s3_utils_1 = require("../aws/s3.utils");
const constants_1 = require("../config/constants");
const tokens_config_1 = require("../config/tokens.config");
const leaderboard_type_enum_1 = require("../leaderboards/enums/leaderboard-type.enum");
const prices_utils_1 = require("../prices/prices.utils");
const user_claim_metadata_1 = require("../rewards/entities/user-claim-metadata");
const tokens_utils_1 = require("../tokens/tokens.utils");
const vaults_utils_1 = require("../vaults/vaults.utils");
const cached_sett_balance_interface_1 = require("./interfaces/cached-sett-balance.interface");
async function getBoostFile(chain) {
  try {
    const boostFile = await (0, s3_utils_1.getObject)(constants_1.REWARD_DATA, `badger-boosts-${chain.chainId}.json`);
    return JSON.parse(boostFile.toString("utf-8"));
  } catch (err) {
    return null;
  }
}
exports.getBoostFile = getBoostFile;
async function getAccounts(chain) {
  const sdk = await chain.getSdk();
  const accounts = new Set();
  let lastAddress;
  const pageSize = 1000;
  while (true) {
    try {
      const userPage = await sdk.graph.loadUsers({
        first: pageSize,
        where: { id_gt: lastAddress },
        orderBy: sdk_1.gqlGenT.User_OrderBy.Id,
        orderDirection: sdk_1.gqlGenT.OrderDirection.Asc
      });
      if (!userPage || !userPage.users || userPage.users.length === 0) {
        break;
      }
      const { users } = userPage;
      lastAddress = users[users.length - 1].id;
      users.forEach((user) => {
        const address = ethers_1.ethers.utils.getAddress(user.id);
        if (!accounts.has(address)) {
          accounts.add(address);
        }
      });
    } catch (err) {
      break;
    }
  }
  if (constants_1.PRODUCTION) {
    console.log(`Retrieved ${accounts.size} accounts on ${chain.network}`);
  }
  return [...accounts];
}
exports.getAccounts = getAccounts;
async function queryCachedAccount(address) {
  const checksummedAccount = ethers_1.ethers.utils.getAddress(address);
  const defaultAccount = {
    address: checksummedAccount,
    balances: [],
    updatedAt: 0
  };
  const baseAccount = Object.assign(new cached_account_model_1.CachedAccount(), defaultAccount);
  try {
    const mapper = (0, dynamodb_utils_1.getDataMapper)();
    for await (const item of mapper.query(
      cached_account_model_1.CachedAccount,
      { address: checksummedAccount },
      { limit: 1, scanIndexForward: false }
    )) {
      return item;
    }
    return mapper.put(baseAccount);
  } catch (err) {
    return baseAccount;
  }
}
exports.queryCachedAccount = queryCachedAccount;
async function toVaultBalance(chain, vaultBalance, currency) {
  const vaultDefinition = await chain.vaults.getVault(vaultBalance.sett.id);
  const { netShareDeposit, grossDeposit, grossWithdraw } = vaultBalance;
  const vault = await (0, vaults_utils_1.getCachedVault)(chain, vaultDefinition);
  const { pricePerFullShare } = vault;
  const depositToken = await (0, tokens_utils_1.getFullToken)(chain, vaultDefinition.depositToken);
  const settToken = await (0, tokens_utils_1.getFullToken)(chain, vaultDefinition.address);
  const currentTokens = (0, sdk_1.formatBalance)(netShareDeposit, settToken.decimals);
  let depositTokenDecimals = depositToken.decimals;
  if (depositToken.address === tokens_config_1.TOKENS.DIGG) {
    depositTokenDecimals = settToken.decimals;
  }
  const depositedTokens = (0, sdk_1.formatBalance)(grossDeposit, depositTokenDecimals);
  const withdrawnTokens = (0, sdk_1.formatBalance)(grossWithdraw, depositTokenDecimals);
  const balanceTokens = currentTokens * pricePerFullShare;
  const earnedBalance = balanceTokens - depositedTokens + withdrawnTokens;
  const [depositTokenPrice, earnedTokens, tokens] = await Promise.all([
    (0, prices_utils_1.getPrice)(vaultDefinition.depositToken),
    (0, tokens_utils_1.getVaultTokens)(chain, vault, currency),
    (0, tokens_utils_1.getVaultTokens)(chain, vault, currency)
  ]);
  const depositTokenConvertedPrice = await (0, prices_utils_1.convert)(depositTokenPrice.price, currency);
  return Object.assign(new cached_sett_balance_interface_1.CachedSettBalance(), {
    network: chain.network,
    address: vaultDefinition.address,
    name: vaultDefinition.name,
    symbol: depositToken.symbol,
    pricePerFullShare: pricePerFullShare,
    balance: balanceTokens,
    value: depositTokenConvertedPrice * balanceTokens,
    tokens,
    earnedBalance: earnedBalance,
    earnedValue: depositTokenConvertedPrice * earnedBalance,
    earnedTokens,
    depositedBalance: depositedTokens,
    withdrawnBalance: withdrawnTokens
  });
}
exports.toVaultBalance = toVaultBalance;
async function getCachedBoost(chain, address) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for await (const entry of mapper.query(
    cached_boost_model_1.CachedBoost,
    { leaderboard: (0, dynamodb_utils_1.getLeaderboardKey)(chain), address: ethers_1.ethers.utils.getAddress(address) },
    { limit: 1, indexName: "IndexLeaderBoardRankOnAddressAndLeaderboard" }
  )) {
    return entry;
  }
  return {
    address,
    boost: 1,
    boostRank: 0,
    bveCvxBalance: 0,
    diggBalance: 0,
    leaderboard: `${chain.network}_${leaderboard_type_enum_1.LeaderBoardType.BadgerBoost}`,
    nativeBalance: 0,
    nftBalance: 0,
    nonNativeBalance: 0,
    stakeRatio: 0,
    updatedAt: 0
  };
}
exports.getCachedBoost = getCachedBoost;
async function getCachedAccount(chain, address) {
  const [cachedAccount, metadata] = await Promise.all([queryCachedAccount(address), getLatestMetadata(chain)]);
  if (!cachedAccount.updatedAt || cachedAccount.updatedAt + sdk_1.ONE_MIN_MS < Date.now()) {
    await refreshAccountVaultBalances(chain, address);
  }
  const claimableBalanceSnapshot = await getClaimableBalanceSnapshot(chain, address, metadata.startBlock);
  const { network } = chain;
  const balances = cachedAccount.balances
    .filter((bal) => bal.network === network)
    .map((bal) => ({
      ...bal,
      tokens: bal.tokens,
      earnedTokens: bal.earnedTokens
    }));
  const data = Object.fromEntries(balances.map((bal) => [bal.address, bal]));
  const claimableBalances = Object.fromEntries(
    claimableBalanceSnapshot.claimableBalances.map((bal) => [bal.address, bal.balance])
  );
  const cachedBoost = await getCachedBoost(chain, cachedAccount.address);
  const { boost, boostRank, stakeRatio, nftBalance, bveCvxBalance, nativeBalance, nonNativeBalance, diggBalance } =
    cachedBoost;
  const value = balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
  const earnedValue = balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
  const account = {
    address,
    value,
    earnedValue,
    boost,
    boostRank,
    data,
    claimableBalances,
    stakeRatio,
    nftBalance,
    bveCvxBalance,
    diggBalance,
    nativeBalance,
    nonNativeBalance
  };
  return account;
}
exports.getCachedAccount = getCachedAccount;
async function getClaimableBalanceSnapshot(chain, address, startBlock) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  for await (const entry of mapper.query(
    user_claim_snapshot_model_1.UserClaimSnapshot,
    {
      chainStartBlock: (0, dynamodb_utils_1.getChainStartBlockKey)(chain, startBlock),
      address: ethers_1.ethers.utils.getAddress(address)
    },
    { limit: 1, indexName: "IndexUnclaimedSnapshotsOnAddressAndChainStartBlock" }
  )) {
    return entry;
  }
  return {
    chainStartBlock: (0, dynamodb_utils_1.getChainStartBlockKey)(chain, startBlock),
    address,
    chain: chain.network,
    startBlock,
    claimableBalances: [],
    pageId: -1,
    expiresAt: Date.now()
  };
}
exports.getClaimableBalanceSnapshot = getClaimableBalanceSnapshot;
async function getLatestMetadata(chain) {
  const mapper = (0, dynamodb_utils_1.getDataMapper)();
  let result = null;
  for await (const metric of mapper.query(
    user_claim_metadata_1.UserClaimMetadata,
    { chain: chain.network },
    { indexName: "IndexMetadataChainAndStartBlock", scanIndexForward: false, limit: 1 }
  )) {
    result = metric;
  }
  // In case there UserClaimMetadata wasn't created yet, create it with default values
  if (!result) {
    const blockNumber = await chain.provider.getBlockNumber();
    const metaData = Object.assign(new user_claim_metadata_1.UserClaimMetadata(), {
      startBlock: blockNumber,
      endBlock: blockNumber + 1,
      chainStartBlock: (0, dynamodb_utils_1.getChainStartBlockKey)(chain, blockNumber),
      chain: chain.network,
      count: 0
    });
    result = await mapper.put(metaData);
  }
  return result;
}
exports.getLatestMetadata = getLatestMetadata;
async function refreshAccountVaultBalances(chain, account) {
  try {
    const sdk = await chain.getSdk();
    const { user } = await sdk.graph.loadUser({ id: account.toLowerCase() });
    if (user) {
      const address = ethers_1.ethers.utils.getAddress(user.id);
      const cachedAccount = await queryCachedAccount(address);
      const userBalances = user.settBalances;
      if (userBalances) {
        const balances = await Promise.all(
          userBalances.filter(async (balance) => {
            try {
              await chain.vaults.getVault(balance.sett.id);
              return true;
            } catch (err) {
              return false;
            }
          })
        );
        const userVaultBalances = await Promise.all(balances.map(async (bal) => toVaultBalance(chain, bal)));
        cachedAccount.balances = cachedAccount.balances
          .filter((bal) => bal.network !== chain.network)
          .concat(userVaultBalances);
        const mapper = (0, dynamodb_utils_1.getDataMapper)();
        await mapper.put(cachedAccount);
      }
    }
  } catch (err) {
    console.log({ err, message: `Unable to update account ${account} on ${chain.network}` });
  }
}
exports.refreshAccountVaultBalances = refreshAccountVaultBalances;
//# sourceMappingURL=accounts.utils.js.map
