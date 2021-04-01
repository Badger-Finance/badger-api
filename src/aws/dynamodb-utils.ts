import AWS from 'aws-sdk';
import {
  AttributeDefinitions,
  BatchWriteItemInput,
  BatchWriteItemRequestMap,
  CreateTableInput,
  DeleteTableInput,
  DescribeTableInput,
  DocumentClient,
  KeySchema,
  PutItemInput,
  QueryInput,
  TableDescription,
  TransactWriteItemsInput,
} from 'aws-sdk/clients/dynamodb';
import AttributeValue = DocumentClient.AttributeValue;
const dynamodb: DynamoDbClient = require('serverless-dynamodb-client');

interface DynamoDbClient {
  doc: AWS.DynamoDB.DocumentClient;
  raw: AWS.DynamoDB;
}
const documentClient = dynamodb.doc;
const client = dynamodb.raw;

export const saveItem = async (table: string, item: AttributeValue): Promise<void> => {
  const params: PutItemInput = {
    TableName: table,
    Item: item,
  };
  await documentClient.put(params).promise();
};

export const saveItems = async (items: BatchWriteItemRequestMap): Promise<void> => {
  const params: BatchWriteItemInput = {
    RequestItems: items,
  };
  await documentClient.batchWrite(params).promise();
};

export const getItems = async <T>(query: QueryInput): Promise<T[] | null> => {
  const data = await documentClient.query(query).promise();
  if (!data.Items || data.Items.length === 0) return null;
  return data.Items as T[];
};

export const transactWrite = async (input: TransactWriteItemsInput): Promise<void> => {
  await client.transactWriteItems(input).promise();
};

export const getTable = async (table: string): Promise<TableDescription | undefined> => {
  const lookupParams: DescribeTableInput = {
    TableName: table,
  };
  try {
    const description = await client.describeTable(lookupParams).promise();
    return description.Table;
  } catch (err) {
    return undefined;
  }
};

export const createTable = async (
  table: string,
  keySchema: KeySchema,
  attributes: AttributeDefinitions,
): Promise<void> => {
  const existingTable = await getTable(table);
  if (existingTable) {
    return;
  }
  const createParams: CreateTableInput = {
    TableName: table,
    KeySchema: keySchema,
    BillingMode: 'PAY_PER_REQUEST',
    AttributeDefinitions: attributes,
  };
  await client.createTable(createParams).promise();
};

export const deleteTable = async (table: string): Promise<void> => {
  const existingTable = await getTable(table);
  if (!existingTable) {
    return;
  }
  const params: DeleteTableInput = {
    TableName: table,
  };
  await client.deleteTable(params).promise();
};

export const priceKeySchema: KeySchema = [
  {
    AttributeName: 'address',
    KeyType: 'HASH',
  },
  {
    AttributeName: 'updatedAt',
    KeyType: 'Range',
  },
];

export const priceAttributes: AttributeDefinitions = [
  {
    AttributeName: 'address',
    AttributeType: 'S',
  },
  {
    AttributeName: 'updatedAt',
    AttributeType: 'N',
  },
];
