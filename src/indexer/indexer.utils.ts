import { BigNumber } from '@ethersproject/bignumber';
import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Protocol } from '../config/enums/protocol.enum';
import { Sett__factory } from '../contracts';
import { getArbitrumBlock } from '../etherscan/etherscan.utils';
import { getPrice } from '../prices/prices.utils';
import { SourceType } from '../protocols/enums/source-type.enum';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { getVaultCachedValueSources } from '../protocols/protocols.utils';
import { ConvexStrategy, getCurvePerformance } from '../protocols/strategies/convex.strategy';
import { mStableStrategy } from '../protocols/strategies/mstable.strategy';
import { PancakeswapStrategy } from '../protocols/strategies/pancakeswap.strategy';
import { QuickswapStrategy } from '../protocols/strategies/quickswap.strategy';
import { SushiswapStrategy } from '../protocols/strategies/sushiswap.strategy';
import { UniswapStrategy } from '../protocols/strategies/uniswap.strategy';
import { RewardsService } from '../rewards/rewards.service';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { SettsService } from '../setts/setts.service';
import { getSett } from '../setts/setts.utils';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { formatBalance, getToken } from '../tokens/tokens.utils';

export const settToCachedSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedSettSnapshot> => {
  const settToken = getToken(settDefinition.settToken);
  const depositToken = getToken(settDefinition.depositToken);
  const { sett } = await getSett(chain.graphUrl, settToken.address);

  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${settToken.name} sett not found`);
  }

  const { balance, totalSupply, pricePerFullShare } = sett;
  const balanceDecimals = settDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = settDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = balance / Math.pow(10, balanceDecimals);
  const supply = totalSupply / Math.pow(10, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, settDefinition);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new CachedSettSnapshot(), {
    address: settToken.address,
    balance: tokenBalance,
    ratio,
    settValue: parseFloat(value.toFixed(2)),
    supply,
  });
};

export const settToSnapshot = async (
  chain: Chain,
  settDefinition: SettDefinition,
  block: number,
): Promise<SettSnapshot | null> => {
  let queryBlock = block;
  if (chain.network === ChainNetwork.Arbitrum) {
    const refChain = Chain.getChain(ChainNetwork.Ethereum);
    const refBlock = await refChain.provider.getBlock(block);
    queryBlock = await getArbitrumBlock(refBlock.timestamp);
  }
  const sett = await getSett(chain.graphUrl, settDefinition.settToken, queryBlock);
  const settToken = getToken(settDefinition.settToken);
  const depositToken = getToken(settDefinition.depositToken);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare } = sett.sett;
  const blockData = await chain.provider.getBlock(queryBlock);
  const timestamp = blockData.timestamp * 1000;
  const balanceDecimals = settDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = settDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = balance / Math.pow(10, balanceDecimals);
  const supply = totalSupply / Math.pow(10, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, settDefinition, queryBlock);
  const tokenPriceData = await getPrice(depositToken.address);
  const value = tokenBalance * tokenPriceData.usd;

  return Object.assign(new SettSnapshot(), {
    address: settToken.address,
    height: block,
    timestamp,
    balance: tokenBalance,
    supply,
    ratio,
    value: parseFloat(value.toFixed(4)),
  });
};

const getPricePerShare = async (
  chain: Chain,
  pricePerShare: BigNumber,
  sett: SettDefinition,
  block?: number,
): Promise<number> => {
  const token = getToken(sett.settToken);
  try {
    let ppfs: BigNumber;
    const contract = Sett__factory.connect(sett.settToken, chain.provider);
    if (block) {
      ppfs = await contract.getPricePerFullShare({ blockTag: block });
    } else {
      ppfs = await contract.getPricePerFullShare();
    }
    return formatBalance(ppfs, token.decimals);
  } catch (err) {
    return formatBalance(pricePerShare, token.decimals);
  }
};

export const getIndexedBlock = async (
  settDefinition: SettDefinition,
  startBlock: number,
  alignment: number,
): Promise<number> => {
  const alignedStartBlock = startBlock - (startBlock % alignment);
  try {
    const mapper = getDataMapper();
    const settToken = getToken(settDefinition.settToken);
    for await (const snapshot of mapper.query(
      SettSnapshot,
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
  settDefinition: SettDefinition,
  type: string,
): CachedValueSource => {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${settDefinition.settToken}_${type}`,
    address: settDefinition.settToken,
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

export async function getUnderlyingPerformance(settDefinition: SettDefinition): Promise<CachedValueSource> {
  return valueSourceToCachedValueSource(
    await SettsService.getSettPerformance(settDefinition),
    settDefinition,
    SourceType.Compound,
  );
}

export async function getSettTokenPerformances(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  const performances = await SettsService.getSettTokenPerformance(chain, settDefinition);
  return performances.map((perf) => valueSourceToCachedValueSource(perf, settDefinition, 'derivative'));
}

export async function getProtocolValueSources(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  try {
    switch (settDefinition.protocol) {
      case Protocol.Curve:
        return Promise.all([getCurvePerformance(chain, settDefinition)]);
      case Protocol.Pancakeswap:
        return PancakeswapStrategy.getValueSources(chain, settDefinition);
      case Protocol.Sushiswap:
        return SushiswapStrategy.getValueSources(chain, settDefinition);
      case Protocol.Convex:
        return ConvexStrategy.getValueSources(chain, settDefinition);
      case Protocol.Uniswap:
        return UniswapStrategy.getValueSources(settDefinition);
      case Protocol.Quickswap:
        return QuickswapStrategy.getValueSources(settDefinition);
      case Protocol.mStable:
        return mStableStrategy.getValueSources(chain, settDefinition);
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

export async function getEmissionApySnapshots(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  const emissions = await RewardsService.getRewardEmission(chain, settDefinition);
  return emissions.map((source) =>
    valueSourceToCachedValueSource(source, settDefinition, source.name.replace(' ', '_').toLowerCase()),
  );
}

export async function getSettValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  try {
    const [underlying, emission, protocol, derivative] = await Promise.all([
      getUnderlyingPerformance(settDefinition),
      getEmissionApySnapshots(chain, settDefinition),
      getProtocolValueSources(chain, settDefinition),
      getSettTokenPerformances(chain, settDefinition),
    ]);

    // check for any emission removal
    const oldSources: Record<string, CachedValueSource> = {};
    const oldEmission = await getVaultCachedValueSources(settDefinition);
    oldEmission.forEach((source) => (oldSources[source.addressValueSourceType] = source));

    // remove updated sources from old source list
    const newSources = [underlying, ...emission, ...protocol, ...derivative];
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
