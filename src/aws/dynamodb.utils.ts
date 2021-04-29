import { DataMapper } from '@aws/dynamodb-data-mapper';
import AWS from 'aws-sdk';

const offline = process.env.IS_OFFLINE;

export const getDataMapper = (): DataMapper => {
  let client: AWS.DynamoDB;
  if (offline) {
    client = new AWS.DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: '',
      secretAccessKey: '',
    });
  } else {
    client = new AWS.DynamoDB();
  }
  return new DataMapper({ client });
};
