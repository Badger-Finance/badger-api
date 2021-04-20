import { DynamoDbTable } from "../aws/interfaces/dynamo-table.interface";

export const pricesTable: DynamoDbTable = {
  TableName: 'badger-local-prices',
  KeySchema: [
    { AttributeName: 'address', KeyType: 'HASH' },
    { AttributeName: 'updatedAt', KeyType: 'RANGE' },
  ],
  AttributeDefinitions: [
    { AttributeName: 'address', AttributeType: 'S' },
    { AttributeName: 'updatedAt', AttributeType: 'N' },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};
