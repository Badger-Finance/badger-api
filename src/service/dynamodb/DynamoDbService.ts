import { Service } from "@tsed/common";
import { SettSnapshot } from "../../interface/SettSnapshot";
import { QueryInput } from 'aws-sdk/clients/dynamodb';
import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

/**
 * TODO: Migrate dynamodb read operations here.
 */
@Service()
export class DynamoDbService {
}
