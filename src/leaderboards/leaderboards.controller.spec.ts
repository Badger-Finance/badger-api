import { BadgerType } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Chain } from '../chains/config/chain.config';
import { Server } from '../Server';
import { LeaderBoardsService } from './leaderboards.service';

describe('LeaderBoardsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let service: LeaderBoardsService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    service = PlatformTest.get<LeaderBoardsService>(LeaderBoardsService);
    jest.spyOn(service, 'fetchLeaderboardSummary').mockImplementation(async (chain: Chain) => {
      const multiplier = Number(chain.chainId);
      return {
        summary: {
          [BadgerType.Basic]: multiplier * 1000,
          [BadgerType.Neo]: multiplier * 20,
          [BadgerType.Hero]: multiplier * 35,
          [BadgerType.Hyper]: multiplier * 25,
          [BadgerType.Frenzy]: multiplier * 40,
        },
        updatedAt: 133742069,
      };
    });
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/leaderboards', () => {
    describe('with no specified chain', () => {
      it('returns the ethereum leaderboard', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/leaderboards').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });

    describe('with a specified chain', () => {
      it('returns the specified chain leaderboard', async (done: jest.DoneCallback) => {
        const { body } = await request.get('/v2/leaderboards?chain=arbitrum').expect(200);
        expect(body).toMatchSnapshot();
        done();
      });
    });
  });
});
