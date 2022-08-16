import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Network } from '@badger-dao/sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';

import { isProduction } from '../config/envs';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { Chainish } from './interfaces/chainish.interface';
import { Vaultish } from './interfaces/vaultish.interface';

export function getDataMapper(): DataMapper {
  let client: DynamoDB;
  console.log('somehow getting called');
  if (!isProduction) {
    console.log('returning mock ddb');
    client = new DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: '',
      secretAccessKey: '',
    });
  } else {
    console.log('returning real ddb');
    client = new DynamoDB();
  }
  return new DataMapper({ client });
}

export function getLeaderboardKey(network: Network): string {
  return `${network}_${LeaderBoardType.BadgerBoost}`;
}

export function getChainStartBlockKey(network: Network, block: number): string {
  return `${network}_${block}`;
}

export function getVaultEntityId({ network }: Chainish, { address }: Vaultish): string {
  return `${network}-${address}`;
}
