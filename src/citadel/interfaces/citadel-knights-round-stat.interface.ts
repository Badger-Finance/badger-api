import { Protocol } from '@badger-dao/sdk';

export interface CitadelKnightsRoundStat {
  knight: Protocol | string;
  votes: number;
  voteWeight: number;
  votersCount: number;
  funding: number;
}
