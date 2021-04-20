import { AttributeDefinition, BillingMode, KeySchema } from "aws-sdk/clients/dynamodb";

export interface DynamoDbTable {
  TableName: string;
  KeySchema: KeySchema;
  AttributeDefinitions: AttributeDefinition[];
  BillingMode: BillingMode;
}
