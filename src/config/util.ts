import { Block } from '@ethersproject/abstract-provider';
import AWS from 'aws-sdk';
import { PutItemInput, QueryInput } from 'aws-sdk/clients/dynamodb';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { SettFragment } from '../graphql/generated/badger';
import { SettSnapshot } from '../interface/SettSnapshot';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { Ethereum } from './chain/chain';
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
  count?: number,
  reverse?: boolean,
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
  if (reverse && data.Items) data.Items = data.Items.reverse();
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

const blockToHour = (value: number) => value * 276;
export const blockToDay = (value: number) => blockToHour(value) * 24;
const secondToHour = (value: number) => value * 3600;
export const secondToDay = (value: number) => secondToHour(value) * 24;
export const toRate = (value: number, duration: number) => (duration !== 0 ? value / duration : value);
