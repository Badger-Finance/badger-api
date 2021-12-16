import { Network, Protocol } from '@badger-dao/sdk';
import { NotFound } from '@tsed/exceptions';
import { getAccountMap } from '../accounts/accounts.utils';
import { AccountMap } from '../accounts/interfaces/account-map.interface';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { getArbitrumBlock } from '../etherscan/etherscan.utils';
import { getPrice } from '../prices/prices.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { uniformPerformance } from '../protocols/interfaces/performance.interface';
import { createValueSource, ValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultCachedValueSources, tokenEmission } from '../protocols/protocols.utils';
import { ConvexStrategy, getCurvePerformance } from '../protocols/strategies/convex.strategy';
import { mStableStrategy } from '../protocols/strategies/mstable.strategy';
import { PancakeswapStrategy } from '../protocols/strategies/pancakeswap.strategy';
import { QuickswapStrategy } from '../protocols/strategies/quickswap.strategy';
import { SushiswapStrategy } from '../protocols/strategies/sushiswap.strategy';
import { SwaprStrategy } from '../protocols/strategies/swapr.strategy';
import { UniswapStrategy } from '../protocols/strategies/uniswap.strategy';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getRewardEmission } from '../rewards/rewards.utils';
import { CachedSettSnapshot } from '../vaults/interfaces/cached-sett-snapshot.interface';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { VaultSnapshot } from '../vaults/interfaces/vault-snapshot.interface';
import { VaultsService } from '../vaults/vaults.service';
import { getBoostWeight, getPricePerShare, getSett, getStrategyInfo } from '../vaults/vaults.utils';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { formatBalance, getToken } from '../tokens/tokens.utils';
import { UserClaimMetadata } from '../rewards/entities/user-claim-metadata';
import { Ethereum } from '../chains/config/eth.config';

// TODO: Figure out what to do with accounts indexer stuff

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

// TODO: Figure out what to do with accounts indexer stuff

export async function settToCachedSnapshot(
  chain: Chain,
  VaultDefinition: VaultDefinition,
): Promise<CachedSettSnapshot> {
  const settToken = getToken(VaultDefinition.settToken);
  const depositToken = getToken(VaultDefinition.depositToken);
  const { sett } = await getSett(chain.graphUrl, settToken.address);

  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${settToken.name} sett not found`);
  }

  const { balance, totalSupply, pricePerFullShare } = sett;
  const balanceDecimals = VaultDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = VaultDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = formatBalance(balance, balanceDecimals);
  const supply = formatBalance(totalSupply, supplyDecimals);
  const [ratio, tokenPriceData, strategyInfo, boostWeight] = await Promise.all([
    getPricePerShare(chain, pricePerFullShare, VaultDefinition),
    getPrice(depositToken.address),
    getStrategyInfo(chain, VaultDefinition),
    getBoostWeight(chain, VaultDefinition),
  ]);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new CachedSettSnapshot(), {
    address: settToken.address,
    balance: tokenBalance,
    ratio,
    settValue: parseFloat(value.toFixed(2)),
    supply,
    strategy: strategyInfo,
    boostWeight,
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
  VaultDefinition: VaultDefinition,
  block: number,
): Promise<VaultSnapshot | null> => {
  const queryBlock = await getQueryBlock(chain, block);
  const sett = await getSett(chain.graphUrl, VaultDefinition.settToken, queryBlock);
  const settToken = getToken(VaultDefinition.settToken);
  const depositToken = getToken(VaultDefinition.depositToken);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare } = sett.sett;
  const blockData = await chain.provider.getBlock(queryBlock);
  const timestamp = blockData.timestamp * 1000;
  const balanceDecimals = VaultDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = VaultDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = formatBalance(balance, balanceDecimals);
  const supply = formatBalance(totalSupply, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, VaultDefinition, queryBlock);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new VaultSnapshot(), {
    address: settToken.address,
    height: block,
    timestamp,
    balance: tokenBalance,
    supply,
    ratio,
    value: parseFloat(value.toFixed(4)),
  });
};

export const getIndexedBlock = async (
  VaultDefinition: VaultDefinition,
  startBlock: number,
  alignment: number,
): Promise<number> => {
  const alignedStartBlock = startBlock - (startBlock % alignment);
  try {
    const mapper = getDataMapper();
    const settToken = getToken(VaultDefinition.settToken);
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
};

export const valueSourceToCachedValueSource = (
  valueSource: ValueSource,
  VaultDefinition: VaultDefinition,
  type: string,
): CachedValueSource => {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${VaultDefinition.settToken}_${type}`,
    address: VaultDefinition.settToken,
    type,
    apr: valueSource.apr,
    name: valueSource.name,
    oneDay: valueSource.performance.oneDay,
    threeDay: valueSource.performance.threeDay,
    sevenDay: valueSource.performance.sevenDay,
    thirtyDay: valueSource.performance.thirtyDay,
    harvestable: Boolean(valueSource.harvestable),
    minApr: valueSource.minApr,
    maxApr: valueSource.maxApr,
    boostable: valueSource.boostable,
  });
};

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

export async function getUnderlyingPerformance(VaultDefinition: VaultDefinition): Promise<CachedValueSource> {
  return valueSourceToCachedValueSource(
    await VaultsService.getSettPerformance(VaultDefinition),
    VaultDefinition,
    SourceType.Compound,
  );
}

export async function getSettTokenPerformances(
  chain: Chain,
  VaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  const performances = await VaultsService.getSettTokenPerformance(chain, VaultDefinition);
  return performances.map((perf) => valueSourceToCachedValueSource(perf, VaultDefinition, 'derivative'));
}

export async function getProtocolValueSources(
  chain: Chain,
  VaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  try {
    switch (VaultDefinition.protocol) {
      case Protocol.Curve:
        return Promise.all([getCurvePerformance(chain, VaultDefinition)]);
      case Protocol.Pancakeswap:
        return PancakeswapStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Sushiswap:
        return SushiswapStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Convex:
        return ConvexStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Uniswap:
        return UniswapStrategy.getValueSources(VaultDefinition);
      case Protocol.Quickswap:
        return QuickswapStrategy.getValueSources(VaultDefinition);
      case Protocol.mStable:
        return mStableStrategy.getValueSources(chain, VaultDefinition);
      case Protocol.Swapr:
        return SwaprStrategy.getValueSources(chain, VaultDefinition);
      default: {
        return [];
      }
    }
  } catch (error) {
    console.log(error);
    // Silently return no value sources
    return [];
  }
}

const ARB_CRV_SETTS = [TOKENS.BARB_CRV_RENBTC, TOKENS.BARB_CRV_TRICRYPTO, TOKENS.BARB_CRV_TRICRYPTO_LITE];

export async function getSettValueSources(
  chain: Chain,
  VaultDefinition: VaultDefinition,
): Promise<CachedValueSource[]> {
  try {
    const [underlying, emission, protocol, derivative] = await Promise.all([
      getUnderlyingPerformance(VaultDefinition),
      getRewardEmission(chain, VaultDefinition),
      getProtocolValueSources(chain, VaultDefinition),
      getSettTokenPerformances(chain, VaultDefinition),
    ]);

    // check for any emission removal
    const oldSources: Record<string, CachedValueSource> = {};
    const oldEmission = await getVaultCachedValueSources(VaultDefinition);
    oldEmission.forEach((source) => (oldSources[source.addressValueSourceType] = source));

    // remove updated sources from old source list
    const newSources = [underlying, ...emission, ...protocol, ...derivative];

    // TODO: remove once badger tree tracking events supported
    if (ARB_CRV_SETTS.includes(VaultDefinition.settToken)) {
      const crvSource = createValueSource('CRV Rewards', uniformPerformance(underlying.apr));
      newSources.push(
        valueSourceToCachedValueSource(crvSource, VaultDefinition, tokenEmission(getToken(TOKENS.ARB_CRV))),
      );
    }
    newSources.forEach((source) => delete oldSources[source.addressValueSourceType]);

    // delete sources which are no longer valid
    const mapper = getDataMapper();
    await Promise.all(Array.from(Object.values(oldSources)).map((source) => mapper.delete(source)));
    return newSources;
  } catch (err) {
    console.log(err);
    return [];
  }
}

export async function getLatestMetadata(chain: Chain): Promise<UserClaimMetadata> {
  const mapper = getDataMapper();
  let result: UserClaimMetadata | null = null;
  for await (const metric of mapper.query(
    UserClaimMetadata,
    { chain: chain.network },
    { scanIndexForward: false, limit: 1 },
  )) {
    result = metric;
  }
  // In case there UserClaimMetadata wasn't created yet, create it with default values
  if (!result) {
    const blockNumber = await chain.provider.getBlockNumber();
    const metaData = Object.assign(new UserClaimMetadata(), {
      startBlock: blockNumber,
      endBlock: blockNumber + 1,
      chainStartBlock: `${chain.network}_${blockNumber}`,
      chain: chain.network,
    });
    result = await mapper.put(metaData);
  }
  return result;
}

export async function getCurrentBlock(chain: Chain): Promise<number> {
  const queryChain = chain.network === Network.Arbitrum ? new Ethereum() : chain;
  return queryChain.provider.getBlockNumber();
}
