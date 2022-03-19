import { DataMapper } from '@aws/dynamodb-data-mapper';
import AWS from 'aws-sdk';
import { Chain } from '../chains/config/chain.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';

const offline = false; //process.env.IS_OFFLINE;

export function getDataMapper(): DataMapper {
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
}

export function getLeaderboardKey(chain: Chain): string {
  return `${chain.network}_${LeaderBoardType.BadgerBoost}`;
}

export function getChainStartBlockKey(chain: Chain, block: number): string {
  return `${chain.network}_${block}`;
}
