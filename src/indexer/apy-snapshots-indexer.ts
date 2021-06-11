import { isNil } from '@tsed/core';
import { getDataMapper } from '../aws/dynamodb.utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { PANCAKESWAP_URL, SUSHISWAP_URL } from '../config/constants';
import { Protocol } from '../config/enums/protocol.enum';
import { getSwapValueSource } from '../protocols/common/performance.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { PancakeSwapService } from '../protocols/pancake/pancakeswap.service';
import { ProtocolsService } from '../protocols/protocols.service';
import { getVaultCachedValueSources } from '../protocols/protocols.utils';
import { SushiswapService } from '../protocols/sushi/sushiswap.service';
import { RewardsService } from '../rewards/rewards.service';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { SettsService } from '../setts/setts.service';
import { valueSourceToCachedValueSource } from './indexer.utils';

export async function refreshApySnapshots() {
  const chains = loadChains();
  const rawValueSources = await Promise.all(
    chains.flatMap((chain) => chain.setts.map((sett) => getSettValueSources(chain, sett))),
  );

  const valueSources = rawValueSources
    .filter((rawValueSource) => !isNil(rawValueSource))
    .flatMap((sources) => sources.filter((source) => !isNaN(source.apr) || !isFinite(source.apr)));

  const mapper = getDataMapper();
  try {
    mapper.batchPut(valueSources);
  } catch (err) {
    console.log({ message: err.message, valueSources });
  }
}

async function getSettValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
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
  mapper.batchDelete(Object.values(oldSources));

  return newSources;
}

async function getUnderlyingPerformance(settDefinition: SettDefinition): Promise<CachedValueSource> {
  return valueSourceToCachedValueSource(
    await SettsService.getSettPerformance(settDefinition),
    settDefinition,
    'underlying',
  );
}

async function getSettTokenPerformances(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const performances = await SettsService.getSettTokenPerformance(chain, settDefinition);
  return performances.map((perf) => valueSourceToCachedValueSource(perf, settDefinition, 'derivative'));
}

async function getProtocolValueSources(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  try {
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

async function getEmissionApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const emissions = await RewardsService.getRewardEmission(chain, settDefinition);
  return emissions.map((source) =>
    valueSourceToCachedValueSource(source, settDefinition, source.name.replace(' ', '_').toLowerCase()),
  );
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
    valueSourceToCachedValueSource(await getPancakeswapPoolApr(chain, depositToken), settDefinition, 'pool_apr'),
  ];
}

async function getSushiswapApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(SUSHISWAP_URL, 'Sushiswap', settDefinition.depositToken),
      settDefinition,
      'swap',
    ),
    valueSourceToCachedValueSource(await getSushiwapPoolApr(chain, settDefinition), settDefinition, 'pool_apr'),
  ];
}

async function getPancakeswapPoolApr(chain: Chain, depositToken: string): Promise<ValueSource> {
  return PancakeSwapService.getEmissionSource(chain, PancakeSwapService.getPoolId(depositToken));
}

async function getSushiwapPoolApr(chain: Chain, settDefinition: SettDefinition): Promise<ValueSource> {
  return SushiswapService.getEmissionSource(chain, settDefinition, await SushiswapService.getMasterChef());
}
