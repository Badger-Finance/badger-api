import { KnightsRoundsQuery } from '../../graphql/generated/citadel.knights.round';

export const knightingRoundKnightGraphMock: KnightsRoundsQuery = {
  knights: [
    {
      id: '0',
      voters: [
        {
          id: '00xef42d748e09a2d9ef89238c053ce0b6f00236210',
        },
      ],
      votes: [
        {
          id: '0x6961d11d4fdafabebb616eb9bcd163a0f1528774112375b612d0ffc63a507b4b',
        },
        {
          id: '0xdc1a188d0e557dffbf9ad40b1371262273b1a754c48251d6cadcdd7e0255dc05',
        },
      ],
      voteCount: '2',
      voteAmount: '3',
    },
  ],
};
