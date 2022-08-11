import { DataMapper } from '@aws/dynamodb-data-mapper';
// import { Network } from '@badger-dao/sdk';
import DynamoDB from 'aws-sdk/clients/dynamodb';

// import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
// import { Chainish } from './interfaces/chainish.interface';
// import { Vaultish } from './interfaces/vaultish.interface';

export function getDataMapper(): DataMapper {
  const offline = process.env.IS_OFFLINE;
  console.log(offline);
  let client: DynamoDB;
  if (offline) {
    client = new DynamoDB({
      region: 'localhost',
      endpoint: 'http://localhost:8000',
      accessKeyId: '',
      secretAccessKey: '',
    });
  } else {
    client = new DynamoDB();
  }
  return new DataMapper({ client });
}

// export function getLeaderboardKey(network: Network): string {
//   return `${network}_${LeaderBoardType.BadgerBoost}`;
// }

// export function getChainStartBlockKey(network: Network, block: number): string {
//   return `${network}_${block}`;
// }

// export function getVaultEntityId({ network }: Chainish, { address }: Vaultish): string {
//   return `${network}-${address}`;
// }
