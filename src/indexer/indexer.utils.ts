import { BigNumber } from '@ethersproject/bignumber';
import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { settAbi } from '../config/abi/abi';
import { yearnAffiliateVaultWrapperAbi } from '../config/abi/yearn-affiliate-vault-wrapper.abi';
import { PANCAKESWAP_URL, SUSHISWAP_URL } from '../config/constants';
import { Protocol } from '../config/enums/protocol.enum';
import { toFloat } from '../config/util';
import { getPrice } from '../prices/prices.utils';
import { getSwapValueSource } from '../protocols/common/performance.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { PancakeSwapService } from '../protocols/pancake/pancakeswap.service';
import { getVaultCachedValueSources } from '../protocols/protocols.utils';
import { SushiswapService } from '../protocols/sushi/sushiswap.service';
import { RewardsService } from '../rewards/rewards.service';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettSnapshot } from '../setts/interfaces/sett-snapshot.interface';
import { SettsService } from '../setts/setts.service';
import { getSett } from '../setts/setts.utils';
import { CachedLiquidityPoolTokenBalance } from '../tokens/interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from '../tokens/interfaces/cached-token-balance.interface';
import { getToken } from '../tokens/tokens.utils';
import { getConvexApySnapshots, getCurvePerformance } from './strategies/convex.strategy';

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
  const sett = await getSett(chain.graphUrl, settDefinition.settToken, block);
  const settToken = getToken(settDefinition.settToken);
  const depositToken = getToken(settDefinition.depositToken);

  if (sett.sett == null) {
    return null;
  }

  const { balance, totalSupply, pricePerFullShare } = sett.sett;
  const blockData = await chain.provider.getBlock(block);
  const timestamp = blockData.timestamp * 1000;
  const balanceDecimals = settDefinition.balanceDecimals || depositToken.decimals;
  const supplyDecimals = settDefinition.supplyDecimals || settToken.decimals;
  const tokenBalance = balance / Math.pow(10, balanceDecimals);
  const supply = totalSupply / Math.pow(10, supplyDecimals);
  const ratio = await getPricePerShare(chain, pricePerFullShare, settDefinition, block);
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
    if (sett.affiliate && sett.affiliate.protocol === Protocol.Yearn) {
      const contract = new ethers.Contract(sett.settToken, yearnAffiliateVaultWrapperAbi, chain.provider);
      if (block) {
        ppfs = await contract.pricePerShare({ blockTag: block });
      } else {
        ppfs = await contract.pricePerShare();
      }
    } else {
      const contract = new ethers.Contract(sett.settToken, settAbi, chain.provider);
      if (block) {
        ppfs = await contract.getPricePerFullShare({ blockTag: block });
      } else {
        ppfs = await contract.getPricePerFullShare();
      }
    }
    return toFloat(ppfs, token.decimals);
  } catch (err) {
    return toFloat(pricePerShare, token.decimals);
  }
};

export const getIndexedBlock = async (settDefinition: SettDefinition, startBlock: number): Promise<number> => {
  try {
    const mapper = getDataMapper();
    const settToken = getToken(settDefinition.settToken);
    for await (const snapshot of mapper.query(
      SettSnapshot,
      { asset: settToken.address },
      { limit: 1, scanIndexForward: false },
    )) {
      return snapshot.height;
    }
    return startBlock;
  } catch (err) {
    return startBlock;
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
    'underlying',
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
        return Promise.all([getCurvePerformance(settDefinition)]);
      case Protocol.Pancakeswap:
        return getPancakeswapApySnapshots(chain, settDefinition);
      case Protocol.Sushiswap:
        return getSushiswapApySnapshots(chain, settDefinition);
      case Protocol.Convex:
        return getConvexApySnapshots(chain, settDefinition);
      case Protocol.Uniswap:
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

export async function getPancakeswapApySnapshots(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  const { depositToken } = settDefinition;
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(PANCAKESWAP_URL, 'Pancakeswap', depositToken),
      settDefinition,
      'swap',
    ),
    valueSourceToCachedValueSource(await getPancakeswapPoolApr(chain, depositToken), settDefinition, 'pool_apr'),
  ];
}

export async function getSushiswapApySnapshots(
  chain: Chain,
  settDefinition: SettDefinition,
): Promise<CachedValueSource[]> {
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(SUSHISWAP_URL, 'Sushiswap', settDefinition.depositToken),
      settDefinition,
      'swap',
    ),
    valueSourceToCachedValueSource(await getSushiwapPoolApr(chain, settDefinition), settDefinition, 'pool_apr'),
  ];
}

export async function getPancakeswapPoolApr(chain: Chain, depositToken: string): Promise<ValueSource> {
  return PancakeSwapService.getEmissionSource(chain, PancakeSwapService.getPoolId(depositToken));
}

export async function getSushiwapPoolApr(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource> {
  return SushiswapService.getEmissionSource(chain, settDefinition, await SushiswapService.getMasterChef());
}

export async function getSettValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const [underlying, emission, protocol, derivative] = await Promise.all([
    getUnderlyingPerformance(settDefinition),
    getEmissionApySnapshots(chain, settDefinition),
    getProtocolValueSources(chain, settDefinition),
    getSettTokenPerformances(chain, settDefinition),
  ]);

  // check for any emission removal
  const oldSources: { [index: string]: CachedValueSource } = {};
  const oldEmission = await getVaultCachedValueSources(settDefinition);
  oldEmission.forEach((source) => (oldSources[source.addressValueSourceType] = source));

  // remove updates sources from old source list
  const newSources = [underlying, ...emission, ...protocol, ...derivative];
  newSources.forEach((source) => delete oldSources[source.addressValueSourceType]);

  // delete sources which are no longer valid
  const mapper = getDataMapper();
  Array.from(Object.values(oldSources)).map((source) => mapper.delete(source));

  return newSources;
}
