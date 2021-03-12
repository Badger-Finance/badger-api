import { Block } from '@ethersproject/abstract-provider';
import AWS from 'aws-sdk';
import { PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import fetch from 'node-fetch';
import { SettFragment } from '../graphql/generated/badger';
import { SettSnapshot } from '../interface/SettSnapshot';
import { TokenPrice } from '../interface/TokenPrice';
import { getContractPrice } from '../prices/PricesService';
import { Ethereum } from './chain';
import { BADGER_URL, SUSHISWAP_URL, UNISWAP_URL } from './constants';
import AttributeValue = DocumentClient.AttributeValue;

export const THIRTY_MIN_BLOCKS = parseInt(String((30 * 60) / 13));
const ddb = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

export type GetPriceFunc = (settFragment: SettFragment) => Promise<TokenPrice>;

export interface EventInput {
  asset: string;
  createdBlock: number;
  contract: string;
  token?: string;
  source?: string;
  pathParameters?: Record<string, string>;
  queryStringParameters?: Record<string, string>;
}

export const getBlock = async (blockNumber: number): Promise<Block> =>
  await new Ethereum().provider.getBlock(blockNumber);

export const saveItem = async (table: string, item: AttributeValue) => {
  const params = {
    TableName: table,
    Item: item,
  } as PutItemInput;
  return await ddb.put(params).promise();
};

export const getAssetData = async (
  table: string,
  asset: AttributeValue,
  count: number | undefined,
): Promise<SettSnapshot[] | undefined> => {
  let params = {
    TableName: table,
    KeyConditionExpression: 'asset = :asset',
    ExpressionAttributeValues: {
      ':asset': asset,
    },
  } as QueryInput;

  if (count) {
    params = {
      ...params,
      Limit: count,
      ScanIndexForward: false,
    };
  }

  const data = await ddb.query(params).promise();
  return data.Items as SettSnapshot[];
};

export const getIndexedBlock = async (table: string, asset: AttributeValue, createdBlock: number): Promise<number> => {
  const params = {
    TableName: table,
    KeyConditionExpression: 'asset = :asset',
    ExpressionAttributeValues: {
      ':asset': asset,
    },
    ScanIndexForward: false,
    Limit: 1,
  };
  const result = await ddb.query(params).promise();
  return result.Items && result.Items.length > 0 ? result.Items[0].height : createdBlock;
};

export type GeyserData = {
  id: string;
  stakingToken: {
    id: string;
  };
  netShareDeposit: number;
};

export type GeyserSett = {
  id: string;
  token: { id: string };
  balance: number;
  netDeposit: string;
  netShareDeposit: string;
  pricePerFullShare: number;
};

export type Geysers = {
  data: {
    geysers: GeyserData[];
    setts: GeyserSett[];
  };
};

export const getGeysers = async (): Promise<Geysers> => {
  const query = `
    {
      geysers(orderDirection: asc) {
        id
        stakingToken {
          id
        }
        netShareDeposit
      },
      setts(orderDirection: asc) {
        id
        token {
          id
        }
        balance
        netDeposit
        netShareDeposit
        pricePerFullShare
      }
    }
  `;
  return await fetch(BADGER_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
};

export const getUniswapPair = async (token: string, block?: number) => {
  const query = `
    {
      pair(id: "${token.toLowerCase()}"${block ? `, block: {number: ${block}}` : ''}) {
				id
        reserve0
        reserve1
        token0 {
          id
					symbol
					name
					decimals
        }
        token1 {
					id
					symbol
					name
					decimals
        }
        totalSupply
      }
    }
  `;
  return await fetch(UNISWAP_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
};

export const getUniswapPrice = async (contract: string): Promise<TokenPrice> => {
  const pair = (await getUniswapPair(contract)).data.pair;
  if (pair.totalSupply === 0) {
    return {
      address: contract,
      usd: 0,
      eth: 0,
    };
  }
  const t0Price = await getContractPrice(pair.token0.id);
  const t1Price = await getContractPrice(pair.token1.id);
  const usdPrice = (t0Price.usd * pair.reserve0 + t1Price.usd * pair.reserve1) / pair.totalSupply;
  const ethPrice = (t0Price.eth * pair.reserve0 + t1Price.eth * pair.reserve1) / pair.totalSupply;
  return {
    address: contract,
    usd: usdPrice,
    eth: ethPrice,
  };
};

export const getSushiswapPair = async (token: string, block?: number) => {
  const query = `
    {
      pair(id: "${token.toLowerCase()}"${block ? `, block: {number: ${block}}` : ''}) {
				id
        reserve0
        reserve1
        token0 {
          id
					symbol
					name
					decimals
        }
        token1 {
          id
					symbol
					name
					decimals
        }
        totalSupply
      }
    }
  `;
  return await fetch(SUSHISWAP_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
  }).then((response) => response.json());
};

export const getSushiswapPrice = async (contract: string): Promise<TokenPrice> => {
  const pair = (await getSushiswapPair(contract)).data.pair;
  if (pair.totalSupply === 0) {
    return {
      address: contract,
      usd: 0,
      eth: 0,
    };
  }
  const t0Price = await getContractPrice(pair.token0.id);
  const t1Price = await getContractPrice(pair.token1.id);
  const usdPrice = (t0Price.usd * pair.reserve0 + t1Price.usd * pair.reserve1) / pair.totalSupply;
  const ethPrice = (t0Price.eth * pair.reserve0 + t1Price.eth * pair.reserve1) / pair.totalSupply;
  return {
    address: contract,
    usd: usdPrice,
    eth: ethPrice,
  };
};

export type SettBalanceData = {
  sett: {
    id: string;
    name: string;
    balance: number;
    totalSupply: number;
    pricePerFullShare: string;
    symbol: string;
    token: {
      id: string;
      decimals: number;
    };
  };
  netDeposit: number;
  grossDeposit: string;
  grossWithdraw: string;
  netShareDeposit: string;
  grossShareDeposit: string;
  grossShareWithdraw: string;
};

export type UserData = {
  data: {
    user: {
      settBalances: SettBalanceData[];
    };
  };
  errors: any;
};

export const getUserData = async (userId: string): Promise<UserData> => {
  const query = `
    {
      user(id: "${userId}") {
        settBalances(orderDirection: asc) {
          sett {
            id
            name
            balance
            totalSupply
            netShareDeposit
            pricePerFullShare
            symbol
            token {
              id
              decimals
            }
          }
          netDeposit
          grossDeposit
          grossWithdraw
          netShareDeposit
          grossShareDeposit
          grossShareWithdraw
        }
      }
    }
  `;
  const queryResult = await fetch(BADGER_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  return queryResult.json();
};

const blockToHour = (value: number) => value * 276;
export const blockToDay = (value: number) => blockToHour(value) * 24;
const secondToHour = (value: number) => value * 3600;
export const secondToDay = (value: number) => secondToHour(value) * 24;
export const toRate = (value: number, duration: number) => (duration !== 0 ? value / duration : value);
