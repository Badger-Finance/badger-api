import { formatBalance, Network } from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { getAccountMap } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { getArbitrumBlock } from '../etherscan/etherscan.utils';
import { getPrice } from '../prices/prices.utils';
import { CachedVaultSnapshot } from '../vaults/interfaces/cached-vault-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { getBoostWeight, getPricePerShare, getStrategyInfo, getCachedVault } from '../vaults/vaults.utils';
import { CachedVaultTokenBalance } from '../tokens/interfaces/cached-vault-token-balance.interface';
import { getToken, toBalance } from '../tokens/tokens.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { GraphQLClient } from 'graphql-request';
import { SettQuery, getSdk } from '../graphql/generated/badger';

export function chunkArray(addresses: string[], count: number): string[][] {
  const chunks: string[][] = [];
  const chunkSize = addresses.length / count;
  for (let i = 0; i < addresses.length; i += chunkSize) {
    chunks.push(addresses.slice(i, i + chunkSize));
  }
  return chunks;
}

export async function batchRefreshAccounts(
  accounts: string[],
  refreshFns: (batchAccounts: AccountMap) => Promise<void>[],
  customBatch?: number,
): Promise<void> {
  const batchSize = customBatch ?? 500;
  const mapper = getDataMapper();
  for (let i = 0; i < accounts.length; i += batchSize) {
    const addresses = accounts.slice(i, i + batchSize);
    const batchAccounts = await getAccountMap(addresses);
    await Promise.all(refreshFns(batchAccounts));
    const cachedAccounts = Object.values(batchAccounts).map((account) => Object.assign(new CachedAccount(), account));
    for await (const _item of mapper.batchPut(cachedAccounts)) {
    }
  }
}

export async function vaultToCachedSnapshot(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedVaultSnapshot> {
  const sdk = await chain.getSdk();
  const { address, totalSupply, balance, pricePerFullShare, available } = await sdk.vaults.loadVault({
    address: vaultDefinition.vaultToken,
    requireRegistry: false,
    status: 2,
    version: 'v1',
  });

  const [tokenPriceData, strategyInfo, boostWeight] = await Promise.all([
    getPrice(vaultDefinition.depositToken),
    getStrategyInfo(chain, vaultDefinition),
    getBoostWeight(chain, vaultDefinition),
  ]);
  const value = balance * tokenPriceData.price;

  return Object.assign(new CachedVaultSnapshot(), {
    address,
    balance,
    pricePerFullShare,
    value: parseFloat(value.toFixed(2)),
    supply: totalSupply,
    available,
    strategy: strategyInfo,
    boostWeight: boostWeight.toNumber(),
  });
}

export async function getQueryBlock(chain: Chain, block: number): Promise<number> {
  let queryBlock = block;
  if (chain.network === Network.Arbitrum) {
    const refChain = Chain.getChain(Network.Ethereum);
    const refBlock = await refChain.provider.getBlock(block);
    queryBlock = await getArbitrumBlock(refBlock.timestamp);
  }
  return queryBlock;
}

export async function settToSnapshot(
  chain: Chain,
  vaultDefinition: VaultDefinition,
  block: number,
): Promise<VaultSnapshot | null> {
  const queryBlock = await getQueryBlock(chain, block);
  const { sett } = await getVault(chain.graphUrl, vaultDefinition.vaultToken, queryBlock);
  const settToken = getToken(vaultDefinition.vaultToken);
  const depositToken = getToken(vaultDefinition.depositToken);

  if (sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare, available } = sett;
  const blockData = await chain.provider.getBlock(queryBlock);
  const timestamp = blockData.timestamp * 1000;
  const balanceDecimals = vaultDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = vaultDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = formatBalance(balance, balanceDecimals);
  const supply = formatBalance(totalSupply, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, vaultDefinition, queryBlock);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.price;

  return Object.assign(new VaultSnapshot(), {
    address: settToken.address,
    height: block,
    timestamp,
    balance: tokenBalance,
    supply,
    available: formatBalance(available, balanceDecimals),
    pricePerFullShare: ratio,
    value: parseFloat(value.toFixed(4)),
  });
}

export async function getIndexedBlock(
  vaultDefinition: VaultDefinition,
  startBlock: number,
  alignment: number,
): Promise<number> {
  const alignedStartBlock = startBlock - (startBlock % alignment);
  try {
    const mapper = getDataMapper();
    const settToken = getToken(vaultDefinition.vaultToken);
    for await (const snapshot of mapper.query(
      VaultSnapshot,
      { address: settToken.address },
      { limit: 1, scanIndexForward: false },
    )) {
      return snapshot.height;
    }
    return alignedStartBlock;
  } catch (err) {
    return alignedStartBlock;
  }
}

export async function getLpTokenBalances(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedVaultTokenBalance> {
  const { protocol, depositToken, vaultToken } = vaultDefinition;
  try {
    if (!protocol) {
      throw new BadRequest('LP balance look up requires a defined protocol');
    }
    const sdk = await chain.getSdk();
    const liquidityData = await getLiquidityData(chain, depositToken);
    const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    const tokenData = await sdk.tokens.loadTokens([token0, token1]);
    const t0Token = tokenData[token0];
    const t1Token = tokenData[token1];

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const settSnapshot = await getCachedVault(vaultDefinition);
    const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
    const t0TokenBalance = reserve0 * valueScalar;
    const t1TokenBalance = reserve1 * valueScalar;
    const tokenBalances = await Promise.all([toBalance(t0Token, t0TokenBalance), toBalance(t1Token, t1TokenBalance)]);

    return Object.assign(new CachedVaultTokenBalance(), {
      vault: vaultToken,
      tokenBalances,
    });
  } catch (err) {
    throw new NotFound(`${protocol} pool pair ${depositToken} does not exist`);
  }
}

// TODO: kill this function
export async function getVault(graphUrl: string, contract: string, block?: number): Promise<SettQuery> {
  const badgerGraphqlClient = new GraphQLClient(graphUrl);
  const badgerGraphqlSdk = getSdk(badgerGraphqlClient);
  const settId = contract.toLowerCase();
  const vars = { id: settId };
  if (block) {
    return badgerGraphqlSdk.SettSnapshot({ ...vars, block: { number: block } });
  }
  return badgerGraphqlSdk.Sett(vars);
}
