import AWS from 'aws-sdk';
const dynamodb: DynamoDbClient = require('serverless-dynamodb-client');

interface DynamoDbClient {
  raw: AWS.DynamoDB;
}

export const dynamo = dynamodb.raw;
