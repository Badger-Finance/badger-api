import { Account, Currency, formatBalance, gqlGenT, Network, ONE_MINUTE_MS } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getChainStartBlockKey, getDataMapper, getLeaderboardKey } from '../aws/dynamodb.utils';
import { CachedAccount } from '../aws/models/cached-account.model';
import { CachedBoost } from '../aws/models/cached-boost.model';
import { UserClaimSnapshot } from '../aws/models/user-claim-snapshot.model';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { PRODUCTION, REWARD_DATA } from '../config/constants';
import { TOKENS } from '../config/tokens.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { convert, getPrice } from '../prices/prices.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { getFullToken, getVaultTokens } from '../tokens/tokens.utils';
import { getCachedVault } from '../vaults/vaults.utils';
import { CachedSettBalance } from './interfaces/cached-sett-balance.interface';

export async function getBoostFile(chain: Chain): Promise<BoostData | null> {
  try {
    const boostFile = await getObject(REWARD_DATA, `badger-boosts-${chain.chainId}.json`);
    return JSON.parse(boostFile.toString('utf-8'));
  } catch (err) {
    return null;
  }
}

export async function getAccounts(chain: Chain): Promise<string[]> {
  const sdk = await chain.getSdk();
  const accounts = new Set<string>();

  let lastAddress: string | undefined;
  const pageSize = 1000;
  while (true) {
    try {
      const userPage = await sdk.graph.loadUsers({
        first: pageSize,
        where: { id_gt: lastAddress },
        orderBy: gqlGenT.User_OrderBy.Id,
        orderDirection: gqlGenT.OrderDirection.Asc,
      });
      if (!userPage || !userPage.users || userPage.users.length === 0) {
        break;
      }
      const { users } = userPage;
      lastAddress = users[users.length - 1].id;
      users.forEach((user) => {
        const address = ethers.utils.getAddress(user.id);
        if (!accounts.has(address)) {
          accounts.add(address);
        }
      });
    } catch (err) {
      break;
    }
  }

  if (PRODUCTION) {
    console.log(`Retrieved ${accounts.size} accounts on ${chain.network}`);
  }

  return [...accounts];
}

export async function queryCachedAccount(address: string): Promise<CachedAccount> {
  const checksummedAccount = ethers.utils.getAddress(address);
  const defaultAccount: CachedAccount = {
    address: checksummedAccount,
    balances: [],
    updatedAt: 0,
  };
  const baseAccount = Object.assign(new CachedAccount(), defaultAccount);
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      CachedAccount,
      { address: checksummedAccount },
      { limit: 1, scanIndexForward: false },
    )) {
      return item;
    }

    return mapper.put(baseAccount);
  } catch (err) {
    return baseAccount;
  }
}

export async function toVaultBalance(
  chain: Chain,
  vaultBalance: gqlGenT.UserSettBalanceFragment,
  currency?: Currency,
): Promise<CachedSettBalance> {
  const vaultDefinition = await chain.vaults.getVault(vaultBalance.sett.id);
  const { netShareDeposit, grossDeposit, grossWithdraw } = vaultBalance;
  const vault = await getCachedVault(chain, vaultDefinition);
  const { pricePerFullShare } = vault;

  const depositToken = await getFullToken(chain, vaultDefinition.depositToken);
  const settToken = await getFullToken(chain, vaultDefinition.address);

  const currentTokens = formatBalance(netShareDeposit, settToken.decimals);
  let depositTokenDecimals = depositToken.decimals;
  if (depositToken.address === TOKENS.DIGG) {
    depositTokenDecimals = settToken.decimals;
  }
  const depositedTokens = formatBalance(grossDeposit, depositTokenDecimals);
  const withdrawnTokens = formatBalance(grossWithdraw, depositTokenDecimals);
  const balanceTokens = currentTokens * pricePerFullShare;
  const earnedBalance = balanceTokens - depositedTokens + withdrawnTokens;
  const [depositTokenPrice, earnedTokens, tokens] = await Promise.all([
    getPrice(vaultDefinition.depositToken),
    getVaultTokens(chain, vault, currency),
    getVaultTokens(chain, vault, currency),
  ]);

  const depositTokenConvertedPrice = await convert(depositTokenPrice.price, currency);

  return Object.assign(new CachedSettBalance(), {
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
    withdrawnBalance: withdrawnTokens,
  });
}

export async function getCachedBoost(network: Network, address: string): Promise<CachedBoost> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    CachedBoost,
    { leaderboard: getLeaderboardKey(network), address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexLeaderBoardRankOnAddressAndLeaderboard' },
  )) {
    return entry;
  }
  return {
    address,
    boost: 1,
    boostRank: 0,
    bveCvxBalance: 0,
    diggBalance: 0,
    leaderboard: `${network}_${LeaderBoardType.BadgerBoost}`,
    nativeBalance: 0,
    nftBalance: 0,
    nonNativeBalance: 0,
    stakeRatio: 0,
    updatedAt: 0,
  };
}

export async function getCachedAccount(chain: Chain, address: string): Promise<Account> {
  const [cachedAccount, metadata] = await Promise.all([queryCachedAccount(address), getLatestMetadata(chain)]);
  if (!cachedAccount.updatedAt || cachedAccount.updatedAt + ONE_MINUTE_MS < Date.now()) {
    await refreshAccountVaultBalances(chain, address);
  }
  const claimableBalanceSnapshot = await getClaimableBalanceSnapshot(chain, address, metadata.startBlock);
  const { network } = chain;
  const balances = cachedAccount.balances
    .filter((bal) => bal.network === network)
    .map((bal) => ({
      ...bal,
      tokens: bal.tokens,
      earnedTokens: bal.earnedTokens,
    }));
  const data = Object.fromEntries(balances.map((bal) => [bal.address, bal]));
  const claimableBalances = Object.fromEntries(
    claimableBalanceSnapshot.claimableBalances.map((bal) => [bal.address, bal.balance]),
  );
  const cachedBoost = await getCachedBoost(network, cachedAccount.address);
  const { boost, boostRank, stakeRatio, nftBalance, bveCvxBalance, nativeBalance, nonNativeBalance, diggBalance } =
    cachedBoost;
  const value = balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
  const earnedValue = balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
  const account: Account = {
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
    nonNativeBalance,
  };
  return account;
}

export async function getClaimableBalanceSnapshot(
  chain: Chain,
  address: string,
  startBlock: number,
): Promise<UserClaimSnapshot> {
  const mapper = getDataMapper();
  for await (const entry of mapper.query(
    UserClaimSnapshot,
    { chainStartBlock: getChainStartBlockKey(chain.network, startBlock), address: ethers.utils.getAddress(address) },
    { limit: 1, indexName: 'IndexUnclaimedSnapshotsOnAddressAndChainStartBlock' },
  )) {
    return entry;
  }
  return {
    chainStartBlock: getChainStartBlockKey(chain.network, startBlock),
    address,
    chain: chain.network,
    startBlock,
    claimableBalances: [],
    pageId: -1,
    expiresAt: Date.now(),
  };
}

export async function getLatestMetadata(chain: Chain): Promise<UserClaimMetadata> {
  const mapper = getDataMapper();
  let result: UserClaimMetadata | null = null;
  for await (const metric of mapper.query(
    UserClaimMetadata,
    { chain: chain.network },
    { indexName: 'IndexMetadataChainAndStartBlock', scanIndexForward: false, limit: 1 },
  )) {
    result = metric;
  }
  // In case there UserClaimMetadata wasn't created yet, create it with default values
  if (!result) {
    const blockNumber = await chain.provider.getBlockNumber();
    const metaData = Object.assign(new UserClaimMetadata(), {
      startBlock: blockNumber,
      endBlock: blockNumber + 1,
      chainStartBlock: getChainStartBlockKey(chain.network, blockNumber),
      chain: chain.network,
      count: 0,
    });
    result = await mapper.put(metaData);
  }
  return result;
}

export async function refreshAccountVaultBalances(chain: Chain, account: string) {
  try {
    const sdk = await chain.getSdk();

    const { user } = await sdk.graph.loadUser({ id: account.toLowerCase() });

    if (user) {
      const address = ethers.utils.getAddress(user.id);
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
          }),
        );

        const userVaultBalances = await Promise.all(balances.map(async (bal) => toVaultBalance(chain, bal)));
        cachedAccount.balances = cachedAccount.balances
          .filter((bal) => bal.network !== chain.network)
          .concat(userVaultBalances);

        const mapper = getDataMapper();
        await mapper.put(cachedAccount);
      }
    }
  } catch (err) {
    console.log({ err, message: `Unable to update account ${account} on ${chain.network}` });
  }
}
