import { DataMapper } from '@aws/dynamodb-data-mapper';
import { isNil } from '@tsed/core';
import flatten from 'lodash/flatten';
import { dynamo } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { PANCAKESWAP_URL, Protocol, SUSHISWAP_URL } from '../config/constants';
import { getSwapValueSource } from '../protocols/common/performance.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { PancakeSwapService } from '../protocols/pancake/pancakeswap.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { SushiswapService } from '../protocols/sushi/sushiswap.service';
import { RewardsService } from '../rewards/rewards.service';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';

export async function refreshApySnapshots() {
  const chains = loadChains();
  const rawValueSources = await Promise.all(
    chains.flatMap((chain) => chain.setts.map((sett) => getSettValueSources(chain, sett))),
  );
  const valueSources = flatten(rawValueSources.filter((rawValueSource) => !isNil(rawValueSource))).filter(
    (source) => !isNaN(source.apy),
  );
  const mapper = new DataMapper({ client: dynamo });
  for (const source of valueSources) {
    // console.log(source);
    await mapper.put(source);
  }
}

async function getSettValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  try {
    await RewardsService.getRewardEmission(chain, settDefinition);
    return [];
    switch (settDefinition.protocol) {
      case Protocol.Curve:
        return getCurveApySnapshots(settDefinition);
      case Protocol.Pancakeswap:
        return getPancakeswapApySnapshots(chain, settDefinition);
      case Protocol.Sushiswap:
        return getSushiswapApySnapshots(chain, settDefinition);
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

async function getCurveApySnapshots(settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const [valueSource] = await ProtocolsService.getCurvePerformance(settDefinition);
  return [valueSourceToCachedValueSource(valueSource, settDefinition, 'swap')];
}

async function getPancakeswapApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const { depositToken } = settDefinition;
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(PANCAKESWAP_URL, 'Pancakeswap', depositToken),
      settDefinition,
      'swap',
    ),
    valueSourceToCachedValueSource(await getPancakeswapPoolApr(chain, depositToken), settDefinition, 'pool-apr'),
  ];
}

async function getSushiswapApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const { depositToken } = settDefinition;
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(SUSHISWAP_URL, 'Sushiswap', depositToken),
      settDefinition,
      'swap',
    ),
    valueSourceToCachedValueSource(await getSushiwapPoolApr(chain, depositToken), settDefinition, 'pool-apr'),
  ];
}

async function getPancakeswapPoolApr(chain: Chain, depositToken: string): Promise<ValueSource> {
  return PancakeSwapService.getEmissionSource(chain, PancakeSwapService.getPoolId(depositToken));
}

async function getSushiwapPoolApr(chain: Chain, depositToken: string): Promise<ValueSource> {
  return SushiswapService.getEmissionSource(chain, depositToken, await SushiswapService.getMasterChef());
}

function valueSourceToCachedValueSource(
  valueSource: ValueSource,
  settDefinition: SettDefinition,
  type: string,
): CachedValueSource {
  return Object.assign(new CachedValueSource(), {
    addressValueSourceType: `${settDefinition.settToken}_${type}`,
    address: settDefinition.settToken,
    type,
    apy: valueSource.apy,
    name: valueSource.name,
    oneDay: valueSource.performance.oneDay,
    threeDay: valueSource.performance.threeDay,
    sevenDay: valueSource.performance.sevenDay,
    thirtyDay: valueSource.performance.thirtyDay,
    harvestable: Boolean(valueSource.harvestable),
  });
}
