import { isNil } from '@tsed/core';
import { TransactWriteItem } from 'aws-sdk/clients/dynamodb';
import flatten from 'lodash/flatten';
import { transactWrite } from '../aws/dynamodb-utils';
import { loadChains } from '../chains/chain';
import { bscSetts } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { ethSetts } from '../chains/config/eth.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { APY_SNAPSHOTS_DATA, PANCAKESWAP_URL, Protocol, SUSHISWAP_URL } from '../config/constants';
import { getSwapValueSource } from '../protocols/common/performance.utils';
import { CachedValueSource } from '../protocols/interfaces/cached-value-source.interface';
import { ValueSource } from '../protocols/interfaces/value-source.interface';
import { PancakeSwapService } from '../protocols/pancake/PancakeSwapService';
import { ProtocolsService } from '../protocols/protocols.service';
import { SushiswapService } from '../protocols/sushi/SushiswapService';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';

const BATCH_SIZE = 10;

export async function refreshApySnapshots() {
  loadChains();

  const rawValueSources = await Promise.all([
    ...bscSetts.map(async (settDefinition) => {
      const getBscValueSource = getSettDefinitionValueSource(ChainNetwork.BinanceSmartChain);
      return getBscValueSource(settDefinition);
    }),
    ...ethSetts.map(async (settDefinition) => {
      const getBscValueSource = getSettDefinitionValueSource(ChainNetwork.Ethereum);
      return getBscValueSource(settDefinition);
    }),
  ]);
  const valueSources = flatten(rawValueSources.filter((rawValueSource) => !isNil(rawValueSource)));

  const transactItems = valueSources.map((valueSource) => valueSourceToTransactItem(valueSource));
  for (let i = 0; i < transactItems.length; i += BATCH_SIZE) {
    const batchedTransactItems = transactItems.slice(i, i + BATCH_SIZE);
    await transactWrite({
      TransactItems: batchedTransactItems,
    });
  }
}

function getSettDefinitionValueSource(
  chainNetwork: ChainNetwork,
): (settDefinition: SettDefinition) => Promise<CachedValueSource[]> {
  const chain = Chain.getChain(chainNetwork);
  return async (settDefinition: SettDefinition) => {
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
      // Silently return no value sources
      return [];
    }
  };
}

async function getCurveApySnapshots(settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const [valueSource] = await ProtocolsService.getCurvePerformance(settDefinition);
  return [
    {
      address: settDefinition.settToken,
      type: 'swap',
      updatedAt: Date.now(),
      apy: valueSource.apy,
      name: valueSource.name,
      oneDay: valueSource.performance.oneDay,
      threeDay: valueSource.performance.threeDay,
      sevenDay: valueSource.performance.sevenDay,
      thirtyDay: valueSource.performance.thirtyDay,
      harvestable: Boolean(valueSource.harvestable),
    },
  ];
}

async function getPancakeswapApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const { depositToken } = settDefinition;
  const updatedAt = Date.now();
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(PANCAKESWAP_URL, 'Pancakeswap', depositToken),
      settDefinition,
      updatedAt,
      'swap',
    ),
    valueSourceToCachedValueSource(
      await getPancakeswapPoolApr(chain, depositToken),
      settDefinition,
      updatedAt,
      'pool-apr',
    ),
  ];
}

async function getSushiswapApySnapshots(chain: Chain, settDefinition: SettDefinition): Promise<CachedValueSource[]> {
  const { depositToken } = settDefinition;
  const updatedAt = Date.now();
  return [
    valueSourceToCachedValueSource(
      await getSwapValueSource(SUSHISWAP_URL, 'Sushiswap', depositToken),
      settDefinition,
      updatedAt,
      'swap',
    ),
    valueSourceToCachedValueSource(
      await getSushiwapPoolApr(chain, depositToken),
      settDefinition,
      updatedAt,
      'pool-apr',
    ),
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
  updatedAt: number,
  type: string,
): CachedValueSource {
  return {
    address: settDefinition.settToken,
    type,
    updatedAt,
    apy: valueSource.apy,
    name: valueSource.name,
    oneDay: valueSource.performance.oneDay,
    threeDay: valueSource.performance.threeDay,
    sevenDay: valueSource.performance.sevenDay,
    thirtyDay: valueSource.performance.thirtyDay,
    harvestable: Boolean(valueSource.harvestable),
  };
}

function valueSourceToTransactItem(valueSource: CachedValueSource): TransactWriteItem {
  return {
    Update: {
      TableName: APY_SNAPSHOTS_DATA,
      Key: {
        addressValueSourceType: {
          S: `${valueSource.address}_${valueSource.type}`,
        },
      },
      UpdateExpression:
        'SET \
          #address = :address, \
          #type = :type, \
          #updatedAt = :updatedAt, \
          #apy = :apy, \
          #name = :name, \
          #oneDay = :oneDay, \
          #threeDay = :threeDay, \
          #sevenDay = :sevenDay, \
          #thirtyDay = :thirtyDay, \
          #harvestable = :harvestable',
      ExpressionAttributeNames: {
        '#address': 'address',
        '#type': 'type',
        '#updatedAt': 'updatedAt',
        '#apy': 'apy',
        '#name': 'name',
        '#oneDay': 'oneDay',
        '#threeDay': 'threeDay',
        '#sevenDay': 'sevenDay',
        '#thirtyDay': 'thirtyDay',
        '#harvestable': 'harvestable',
      },
      ExpressionAttributeValues: {
        ':address': {
          S: valueSource.address,
        },
        ':type': {
          S: valueSource.type,
        },
        ':updatedAt': {
          N: valueSource.updatedAt.toString(),
        },
        ':apy': {
          N: valueSource.apy.toString(),
        },
        ':name': {
          S: valueSource.name,
        },
        ':oneDay': {
          N: valueSource.oneDay.toString(),
        },
        ':threeDay': {
          N: valueSource.threeDay.toString(),
        },
        ':sevenDay': {
          N: valueSource.sevenDay.toString(),
        },
        ':thirtyDay': {
          N: valueSource.thirtyDay.toString(),
        },
        ':harvestable': {
          BOOL: valueSource.harvestable,
        },
      },
    },
  };
}
