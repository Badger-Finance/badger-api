/* eslint-disable @typescript-eslint/ban-ts-comment */
import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import BadgerSDK, { Network, VaultV15, VaultV15__factory } from '@badger-dao/sdk';
import { RewardEventTypeEnum } from '@badger-dao/sdk/lib/citadel/enums/reward-event-type.enum';
import { PlatformTest } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { BigNumber } from 'ethers';
import createMockInstance from 'jest-create-mock-instance';
// import { CitadelService } from '@badger-dao/sdk/lib/citadel';
import { mock } from 'jest-mock-extended';
import SuperTest from 'supertest';

import { Ethereum } from '../chains/config/eth.config';
import { Provider } from '../chains/enums/provider.enum';
import { TOKENS } from '../config/tokens.config';
import * as citadelGraph from '../graphql/generated/citadel';
import * as citadelKnightingRoundGraph from '../graphql/generated/citadel.knights.round';
import { Server } from '../Server';
import { mockPricing, setupMapper, TEST_ADDR } from '../test/tests.utils';
import { fullTokenMockMap } from '../tokens/mocks/full-token.mock';
import * as tokenUtils from '../tokens/tokens.utils';
import * as treasuryUtils from '../treasury/treasury.utils';
import * as citadelUtils from './citadel.utils';
import { citadelChartDataBlobModel } from './mocks/citadel-chart-data-blob.model.mock';
import { knightingRoundVoteGraphMock } from './mocks/knighting-round-knight.graph.mock';
import { queryCitadelDataUtilMock } from './mocks/query-citadel-data.util.mock';
import { queryTreasurySummaryUtilMock } from './mocks/query-treasury-summary.util.mock';
import { REWARD_ACCOUNT_1, RewardsSnapshotModelMock, TEST_XCTDL_TOKEN } from './mocks/rewards-snapshot.model.mock';

describe('CitadelController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeAll(PlatformTest.bootstrap(Server));
  beforeAll(async () => {
    request = SuperTest(PlatformTest.callback());
  });
  afterAll(PlatformTest.reset);

  function setupRewardDatabase() {
    jest.spyOn(Date, 'now').mockImplementation(() => <number>RewardsSnapshotModelMock[1].startTime * 1000);

    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);

    // @ts-ignore
    jest.spyOn(DataMapper.prototype, 'query').mockImplementation((model, keys, opts) => {
      let dataSource = RewardsSnapshotModelMock;
      if (keys.payType === RewardEventTypeEnum.ADDED) {
        dataSource = dataSource.filter((obj) => {
          return <number>obj.startTime >= opts.filter.object;
        });
      }
      if (keys.payType) {
        dataSource = dataSource.filter((obj) => obj.payType === keys.payType);
      }
      if (keys.account) {
        dataSource = dataSource.filter((obj) => obj.account === keys.account);
      }
      if (keys.token) {
        dataSource = dataSource.filter((obj) => obj.token === keys.token);
      }
      // @ts-ignore
      qi[Symbol.iterator] = jest.fn(() => dataSource.map((obj) => Object.assign(new model(), obj)).values());
      return qi;
    });
  }

  describe('GET /citadel/v1/treasury', () => {
    beforeEach(() => {
      jest.spyOn(treasuryUtils, 'queryTreasurySummary').mockImplementation(async () => queryTreasurySummaryUtilMock);
      jest.spyOn(citadelUtils, 'queryCitadelData').mockImplementation(async () => queryCitadelDataUtilMock);

      mockPricing();
    });

    it('returns the current citadel treasury summary', async () => {
      const { body } = await request.get('/citadel/v1/treasury').expect(200);
      expect(body).toMatchSnapshot();
    });
  });

  describe('GET /citadel/v1/summary', () => {
    beforeEach(() => {
      jest.spyOn(citadelUtils, 'queryCitadelData').mockImplementation(async () => queryCitadelDataUtilMock);
    });

    it('returns protocol aggregate rewards information', async () => {
      const { body } = await request.get('/citadel/v1/summary').expect(200);
      expect(body).toMatchSnapshot();
    });
  });

  describe('GET /citadel/v1/rewards', () => {
    beforeEach(() => {
      setupRewardDatabase();
    });

    it('returns paid rewards list', async () => {
      const { body } = await request.get('/citadel/v1/rewards').expect(200);
      expect(body).toMatchSnapshot();
    });

    it('returns added rewards list', async () => {
      const { body } = await request.get(`/citadel/v1/rewards?filter=${RewardEventTypeEnum.ADDED}`).expect(200);
      expect(body).toMatchSnapshot();
    });

    it('returns added rewards list filtered on account', async () => {
      const { body } = await request
        .get(`/citadel/v1/rewards?filter=${RewardEventTypeEnum.ADDED}&account=${REWARD_ACCOUNT_1}`)
        .expect(200);
      expect(body).toMatchSnapshot();
    });

    it('returns added rewards list filtered on token', async () => {
      const { body } = await request
        .get(`/citadel/v1/rewards?filter=${RewardEventTypeEnum.ADDED}&token=${TEST_XCTDL_TOKEN}`)
        .expect(200);
      expect(body).toMatchSnapshot();
    });

    it('returns added rewards list filtered on epoch', async () => {
      const { body } = await request
        .get(`/citadel/v1/rewards?filter=${RewardEventTypeEnum.ADDED}&epoch=${0}`)
        .expect(200);
      expect(body).toMatchSnapshot();
    });

    it('should throw NotFound for unknown filter', async () => {
      const { body } = await request.get(`/citadel/v1/rewards?filter=unknown`).expect(NotFound.STATUS);
      expect(body).toMatchSnapshot();
    });
  });

  describe('GET /citadel/v1/history', () => {
    beforeEach(() => {
      setupMapper([citadelChartDataBlobModel]);
    });

    it('returns timeframed data for charts', async () => {
      const { body } = await request.get('/citadel/v1/history').expect(200);
      expect(body).toMatchSnapshot();
    });
  });

  describe('GET /citadel/v1/accounts', () => {
    beforeEach(async () => {
      setupRewardDatabase();
      mockPricing();
      const sdk = new BadgerSDK({
        network: Network.Ethereum,
        provider: Provider.Cloudflare,
      });
      jest.spyOn(Ethereum.prototype, 'getSdk').mockImplementation(async () => sdk);
      jest.spyOn(sdk, 'ready').mockImplementation();
      // eslint-disable-next-line
      jest.spyOn(sdk as any, 'initialize').mockImplementation(async () => true);

      jest.spyOn(sdk.tokens, 'loadBalances').mockImplementation(async () => ({
        [TOKENS.CTDL]: BigNumber.from(1034 * 18),
        [TOKENS.XCTDL]: BigNumber.from(4004 * 18),
      }));

      jest.spyOn(sdk.citadel, 'lockedBalanceOf').mockImplementation(async () => BigNumber.from(154534534 * 18));

      const citadelGraphSdkMock = {
        VaultBalance: async () => ({
          vaultBalance: {
            netShareDeposit: BigNumber.from(12334),
            grossDeposit: BigNumber.from(343234),
            grossWithdraw: BigNumber.from(566234),
          },
        }),
      };
      // @ts-ignore
      jest.spyOn(citadelGraph, 'getSdk').mockImplementation(() => citadelGraphSdkMock);

      const vaultV15 = mock<VaultV15>();
      jest.spyOn(VaultV15__factory, 'connect').mockImplementation(() => vaultV15);
      vaultV15.getPricePerFullShare.calledWith().mockImplementation(async () => BigNumber.from(21));

      jest.spyOn(sdk.citadel, 'getLastEpochIx').mockImplementation(async () => BigNumber.from('1'));
      jest
        .spyOn(sdk.citadel, 'balanceOf')
        .mockImplementation(async (_account) => BigNumber.from('10000000000000000000'));
      jest.spyOn(sdk.citadel, 'getTotalSupply').mockImplementation(async () => BigNumber.from('10000000000000000000'));
      jest.spyOn(sdk.citadel, 'getRewardTokens').mockImplementation(async () => [TOKENS.BADGER, TOKENS.WBTC]);
      jest.spyOn(sdk.tokens, 'loadToken').mockImplementation(async (token: string) => fullTokenMockMap[token]);

      jest.spyOn(sdk.citadel, 'getCumulativeClaimedRewards').mockImplementation(
        async (_, token: string) =>
          ({
            [TOKENS.BADGER]: BigNumber.from('3000000000000000000000'), // 300 BADGER (18 decimals)
            [TOKENS.WBTC]: BigNumber.from('200000000'), // 2 WBTC (8 decimals)
          }[token]),
      );

      const citadelClaimableRw = [
        {
          token: TOKENS.BCVXCRV,
          amount: BigNumber.from(34 * 18),
        },
        {
          token: TOKENS.BVECVX,
          amount: BigNumber.from(400 * 18),
        },
      ];

      // @ts-ignore
      jest.spyOn(sdk.citadel, 'getClaimableRewards').mockImplementation(async () => citadelClaimableRw);
    });

    it('returns citadel account data', async () => {
      const { body } = await request.get(`/citadel/v1/accounts?address=${TEST_ADDR}`).expect(200);
      expect(body).toMatchSnapshot();
    });
  });

  describe('GET /citadel/v1/leaderboard', () => {
    beforeEach(() => {
      let called = false;
      const citadelKnightingRoundGraphMock = {
        Votes: async () => {
          if (!called) {
            called = true;
            return knightingRoundVoteGraphMock;
          }
          return { votes: [] };
        },
      };
      // @ts-ignore
      jest.spyOn(citadelKnightingRoundGraph, 'getSdk').mockImplementation(() => citadelKnightingRoundGraphMock);

      jest.spyOn(tokenUtils, 'getFullToken').mockImplementation(async () => fullTokenMockMap[TOKENS.CTDL]);
    });

    it('returns knighting round info', async () => {
      const { body } = await request.get('/citadel/v1/leaderboard').expect(200);
      expect(body).toMatchSnapshot();
    });
  });
});
