import AWS from 'aws-sdk';
import {
  BatchWriteItemInput,
  BatchWriteItemOutput,
  BatchWriteItemRequestMap,
  ItemList,
  PutItemInput,
  PutItemInputAttributeMap,
  PutItemOutput,
  QueryInput,
} from 'aws-sdk/clients/dynamodb';

const ddb = new AWS.DynamoDB.DocumentClient();

export const saveItem = async (table: string, item: PutItemInputAttributeMap): Promise<PutItemOutput> => {
  const params: PutItemInput = {
    TableName: table,
    Item: item,
  };
  return await ddb.put(params).promise();
};

export const saveItems = async (items: BatchWriteItemRequestMap): Promise<BatchWriteItemOutput> => {
  const params: BatchWriteItemInput = {
    RequestItems: items,
  };
  return await ddb.batchWrite(params).promise();
};

export const getItem = async (query: QueryInput): Promise<ItemList | null> => {
  const data = await ddb.query(query).promise();
  if (!data.Items || data.Items.length === 0) return null;
  return data.Items;
};
