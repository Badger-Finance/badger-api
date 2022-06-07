import { KnightsRoundsQuery, VotesQuery } from '../../graphql/generated/citadel.knights.round';

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

export const knightingRoundVoteGraphMock: VotesQuery = {
  votes: [
    {
      id: '0x3a4fd25adb4ff9940ff898915f15cc589a00021d02c867320e613dcca2a7e078',
      knight: {
        id: '2',
      },
      voter: {
        id: '0xa967ba66fb284ec18bbe59f65bcf42dd11ba8128',
      },
      amount: '276190476190000000',
    },
    {
      id: '0x8fcf54ccfd681f3ceef70b8b96e14db1c95cea9b864765d162847f4137dbabb4',
      knight: {
        id: '5',
      },
      voter: {
        id: '0xc2e345f74b18187e5489822f9601c028ed1915a2',
      },
      amount: '95238095220000000',
    },
    {
      id: '0x92a4ab357457f40c670785bac023176d4c06a9bc9ab3180939cae61c1429df4a',
      knight: {
        id: '3',
      },
      voter: {
        id: '0xc2e345f74b18187e5489822f9601c028ed1915a2',
      },
      amount: '276190476190000000',
    },
    {
      id: '0xb9d1992f8d2cce278ba7e6089af2dbb1e82a8a6a6fdc803417ce5f01719122ff',
      knight: {
        id: '5',
      },
      voter: {
        id: '0x17879d10c22f17faa0b2a29a36e968712f8127c9',
      },
      amount: '276190476190000000',
    },
    {
      id: '0xf5a479704f66978e5c101aa67beaf8adff8ca6c2603948b1c064d76764922a3e',
      knight: {
        id: '4',
      },
      voter: {
        id: '0xa967ba66fb284ec18bbe59f65bcf42dd11ba8128',
      },
      amount: '999999999810000000',
    },
    {
      id: '0xfd553615365db370df07f2231afcd938e66b27c8f419595277a5d8982e58ae3b',
      knight: {
        id: '7',
      },
      voter: {
        id: '0xc2e345f74b18187e5489822f9601c028ed1915a2',
      },
      amount: '190476190440000000',
    },
  ],
};
