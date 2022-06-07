import { Protocol } from '@badger-dao/sdk';

export interface CitadelKnightsRoundStat {
  funding: number;
  knight: Protocol | string;
  voteAmount: number;
  voteWeight: number;
  votersCount: number;
}
