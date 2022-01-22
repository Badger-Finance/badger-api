import { Network, Protocol } from '@badger-dao/sdk';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { getAccountMap } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { getArbitrumBlock } from '../etherscan/etherscan.utils';
import { getPrice } from '../prices/prices.utils';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { getBoostWeight, getPricePerShare, getVault, getStrategyInfo, getCachedVault } from '../vaults/vaults.utils';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { formatBalance, getToken, toCachedBalance } from '../tokens/tokens.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';

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

export async function settToCachedSnapshot(
  chain: Chain,
  vaultDefinition: VaultDefinition,
): Promise<CachedSettSnapshot> {
  const settToken = getToken(vaultDefinition.vaultToken);
  const depositToken = getToken(vaultDefinition.depositToken);
  const { sett } = await getVault(chain.graphUrl, settToken.address);

  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${settToken.name} sett not found`);
  }

  const { balance, totalSupply, pricePerFullShare, available } = sett;
  const balanceDecimals = vaultDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = vaultDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = formatBalance(balance, balanceDecimals);
  const supply = formatBalance(totalSupply, supplyDecimals);
  const [ratio, tokenPriceData, strategyInfo, boostWeight] = await Promise.all([
    getPricePerShare(chain, pricePerFullShare, vaultDefinition),
    getPrice(depositToken.address),
    getStrategyInfo(chain, vaultDefinition),
    getBoostWeight(chain, vaultDefinition),
  ]);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new CachedSettSnapshot(), {
    address: settToken.address,
    balance: tokenBalance,
    ratio,
    settValue: parseFloat(value.toFixed(2)),
    supply,
    available: formatBalance(available, balanceDecimals),
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

export const settToSnapshot = async (
  chain: Chain,
  vaultDefinition: VaultDefinition,
  block: number,
): Promise<VaultSnapshot | null> => {
  const queryBlock = await getQueryBlock(chain, block);
  const sett = await getVault(chain.graphUrl, vaultDefinition.vaultToken, queryBlock);
  const settToken = getToken(vaultDefinition.vaultToken);
  const depositToken = getToken(vaultDefinition.depositToken);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare, available } = sett.sett;
  const blockData = await chain.provider.getBlock(queryBlock);
  const timestamp = blockData.timestamp * 1000;
  const balanceDecimals = vaultDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = vaultDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = formatBalance(balance, balanceDecimals);
  const supply = formatBalance(totalSupply, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, vaultDefinition, queryBlock);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new VaultSnapshot(), {
    address: settToken.address,
    height: block,
    timestamp,
    balance: tokenBalance,
    supply,
    available: formatBalance(available, balanceDecimals),
    ratio,
    value: parseFloat(value.toFixed(4)),
  });
};

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

export function tokenBalancesToCachedLiquidityPoolTokenBalance(
  pairId: string,
  protocol: Protocol,
  tokenBalances: CachedTokenBalance[],
): CachedLiquidityPoolTokenBalance {
  return Object.assign(new CachedLiquidityPoolTokenBalance(), {
    id: `${pairId}_${protocol}`,
    pairId,
    protocol,
    tokenBalances,
  });
}

export async function getLpTokenBalances(
  chain: Chain,
  vault: VaultDefinition,
): Promise<CachedLiquidityPoolTokenBalance> {
  try {
    if (!vault.protocol) {
      throw new BadRequest('LP balance look up requires a defined protocol');
    }
    const liquidityData = await getLiquidityData(chain, vault.depositToken);
    const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
    const t0Token = getToken(token0);
    const t1Token = getToken(token1);

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const settSnapshot = await getCachedVault(vault);
    const valueScalar = totalSupply > 0 ? settSnapshot.balance / totalSupply : 0;
    const t0TokenBalance = reserve0 * valueScalar;
    const t1TokenBalance = reserve1 * valueScalar;
    const tokenBalances = await Promise.all([
      toCachedBalance(t0Token, t0TokenBalance),
      toCachedBalance(t1Token, t1TokenBalance),
    ]);

    return tokenBalancesToCachedLiquidityPoolTokenBalance(vault.depositToken, vault.protocol, tokenBalances);
  } catch (err) {
    throw new NotFound(`${vault.protocol} pool pair ${vault.depositToken} does not exist`);
  }
}
