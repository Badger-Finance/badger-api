import AWS from 'aws-sdk';
import {
  BatchWriteItemInput,
  BatchWriteItemOutput,
  BatchWriteItemRequestMap,
  DocumentClient,
  PutItemInput,
  PutItemOutput,
  QueryInput,
} from 'aws-sdk/clients/dynamodb';
import AttributeValue = DocumentClient.AttributeValue;

const ddb = new AWS.DynamoDB.DocumentClient();

export const saveItem = async (table: string, item: AttributeValue): Promise<PutItemOutput> => {
  const params: PutItemInput = {
    TableName: table,
    Item: item,
  };
  return ddb.put(params).promise();
};

export const saveItems = async (items: BatchWriteItemRequestMap): Promise<BatchWriteItemOutput> => {
  const params: BatchWriteItemInput = {
    RequestItems: items,
  };
  return ddb.batchWrite(params).promise();
};

export const getItems = async <T>(query: QueryInput): Promise<T[] | null> => {
  const data = await ddb.query(query).promise();
  if (!data.Items || data.Items.length === 0) return null;
  return data.Items as T[];
};
