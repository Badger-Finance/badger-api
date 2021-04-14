import { NotFound } from '@tsed/exceptions';
import { TransactWriteItem } from 'aws-sdk/clients/dynamodb';
import { transactWrite } from '../aws/dynamodb-utils';
import { loadChains } from '../chains/chain';
import { bscSetts } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { ethSetts } from '../chains/config/eth.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { Protocol, SETT_SNAPSHOTS_DATA } from '../config/constants';
import { successfulCapture } from '../config/util';
import { CachedSettSnapshot } from '../setts/interfaces/cached-sett-snapshot.interface';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getSett } from '../setts/setts-util';
import { getToken } from '../tokens/tokens-util';

const BATCH_SIZE = 10;

function snapshotToTransactItem(snapshot: CachedSettSnapshot): TransactWriteItem {
  return {
    Update: {
      TableName: SETT_SNAPSHOTS_DATA,
      Key: {
        address: {
          S: snapshot.address,
        },
      },
      UpdateExpression:
        'SET #balance = :balance, #ratio = :ratio, #supply = :supply, #updatedAt = :updatedAt, #settValue = :settValue',
      ExpressionAttributeNames: {
        '#balance': 'balance',
        '#ratio': 'ratio',
        '#supply': 'supply',
        '#updatedAt': 'updatedAt',
        '#settValue': 'settValue',
      },
      ExpressionAttributeValues: {
        ':balance': {
          N: snapshot.balance.toString(),
        },
        ':ratio': {
          N: snapshot.ratio.toString(),
        },
        ':supply': {
          N: snapshot.supply.toString(),
        },
        ':updatedAt': {
          N: Date.now().toString(),
        },
        ':settValue': {
          N: snapshot.settValue.toString(),
        },
      },
    },
  };
}

function settToSnapshot(chainNetwork: ChainNetwork): (settToken: string) => Promise<CachedSettSnapshot> {
  const chain = Chain.getChain(chainNetwork);
  return async (settToken: string) => {
    const targetToken = getToken(settToken);
    const { sett } = await getSett(chain.graphUrl, settToken);
    if (!sett) {
      // sett has not been indexed yet, or encountered a graph error
      throw new NotFound(`${targetToken.name} sett not found`);
    }
    const { balance, totalSupply, pricePerFullShare, token } = sett;
    const tokenBalance = balance / Math.pow(10, token.decimals);
    const supply = totalSupply / Math.pow(10, 18);
    const settDefintion = chain.setts.find((sett) => sett.settToken.toLowerCase() === settToken);
    if (!settDefintion) {
      throw new NotFound(`${settToken} is not a valid sett token`);
    }
    const ratioDecimals =
      settDefintion.affiliate && settDefintion.affiliate.protocol === Protocol.Yearn ? token.decimals : 18;
    const ratio = pricePerFullShare / Math.pow(10, ratioDecimals);
    const tokenPriceData = await chain.strategy.getPrice(token.id);
    const value = tokenBalance * tokenPriceData.usd;

    return {
      balance: tokenBalance,
      supply,
      ratio,
      address: settToken,
      updatedAt: Date.now(),
      settValue: parseFloat(value.toFixed(2)),
    };
  };
}

const captureSnapshot = async (network: ChainNetwork, sett: SettDefinition): Promise<CachedSettSnapshot | null> => {
  try {
    const snapshotTranslateFn = settToSnapshot(network);
    // purposefully await to leverage try / catch
    const result = await snapshotTranslateFn(sett.settToken);
    return result;
  } catch (err) {
    return null;
  }
};

export async function refreshSettSnapshots() {
  loadChains();

  const snapshots = (
    await Promise.all([
      ...bscSetts.map(async (settDefinition) => captureSnapshot(ChainNetwork.BinanceSmartChain, settDefinition)),
      ...ethSetts.map(async (settDefinition) => captureSnapshot(ChainNetwork.Ethereum, settDefinition)),
    ])
  ).filter(successfulCapture);

  const transactItems = snapshots.map((snapshot) => snapshotToTransactItem(snapshot));
  for (let i = 0; i < snapshots.length; i += BATCH_SIZE) {
    const batchedTransactItems = transactItems.slice(i, i + BATCH_SIZE);
    await transactWrite({
      TransactItems: batchedTransactItems,
    });
  }
}
