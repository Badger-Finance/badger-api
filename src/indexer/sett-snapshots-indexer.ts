import { NotFound } from '@tsed/exceptions';
import { TransactWriteItem } from 'aws-sdk/clients/dynamodb';
import { transactWrite } from '../aws/dynamodb-utils';
import { loadChains } from '../chains/chain';
import { bscSetts } from '../chains/config/bsc.config';
import { Chain } from '../chains/config/chain.config';
import { ethSetts } from '../chains/config/eth.config';
import { ChainNetwork } from '../chains/enums/chain-network.enum';
import { SETT_SNAPSHOTS_DATA } from '../config/constants';
import { SettSnapshot } from '../interface/SettSnapshot';
import { getSett } from '../setts/setts-util';

// Maximum default by AWS
const BATCH_SIZE = 25;

export type CachedSettSnapshot = Partial<SettSnapshot> & {
  address: string;
  updatedAt: number;
};

function snapshotToTransactItem(snapshot: CachedSettSnapshot): TransactWriteItem {
  return {
    Update: {
      TableName: SETT_SNAPSHOTS_DATA,
      Key: { address: { S: snapshot.address } },
      UpdateExpression:
        'SET asset = :asset, balance = :balance, ratio = :ratio, supply = :supply, updatedAt = :updatedAt, value = :value',
      ExpressionAttributeValues: {
        ':balance': { N: snapshot.balance?.toString() },
        ':ratio': { N: snapshot.ratio?.toString() },
        ':supply': { N: snapshot.supply?.toString() },
        ':updatedAt': { N: snapshot.updatedAt.toString() },
        ':value': { N: snapshot.value?.toString() },
      },
    },
  };
}

function settToSnapshot(chainNetwork: ChainNetwork): (settToken: string) => Promise<CachedSettSnapshot> {
  const chain = Chain.getChain(chainNetwork);
  return async (settToken: string) => {
    const { sett } = await getSett(chain.graphUrl, settToken);
    if (!sett) {
      throw new NotFound('Sett not found');
    }
    const { balance, totalSupply, pricePerFullShare, token } = sett;
    const tokenBalance = balance / Math.pow(10, token.decimals);
    const supply = totalSupply / Math.pow(10, token.decimals);
    const ratio = pricePerFullShare / Math.pow(10, 18);
    const tokenPriceData = await chain.strategy.getPrice(token.id);
    const value = tokenBalance * tokenPriceData.usd;

    return {
      balance,
      supply,
      ratio,
      address: settToken,
      updatedAt: Date.now(),
      value: parseFloat(value.toFixed(2)),
    };
  };
}

export async function refreshSettSnapshots() {
  loadChains();

  const snapshots = await Promise.all([
    ...bscSetts.map(async (settDefinition) => {
      const snapshotTranslateFn = settToSnapshot(ChainNetwork.BinanceSmartChain);
      return snapshotTranslateFn(settDefinition.settToken);
    }),
    ...ethSetts.map(async (settDefinition) => {
      const snapshotTranslateFn = settToSnapshot(ChainNetwork.Ethereum);
      return snapshotTranslateFn(settDefinition.settToken);
    }),
  ]);

  for (let i = 0; i < snapshots.length; i += BATCH_SIZE) {
    const batchedSnapshots = snapshots.slice(i, i + BATCH_SIZE);
    await transactWrite({
      TransactItems: batchedSnapshots.map((snapshot) => snapshotToTransactItem(snapshot)),
    });
  }
}
