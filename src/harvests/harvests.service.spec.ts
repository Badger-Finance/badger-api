import { PlatformTest } from '@tsed/common';
import { GraphQLClient } from 'graphql-request';
import { Ethereum } from '../chains/config/eth.config';
import { TOKENS } from '../config/tokens.config';
import { HarvestFragment, HarvestsQuery } from '../graphql/generated/badger';
import { getSettDefinition } from '../setts/setts.utils';
import { getToken } from '../tokens/tokens.utils';
import { HarvestsService } from './harvests.service';

describe('HarvestsService', () => {
  let service: HarvestsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<HarvestsService>(HarvestsService);
  });

  afterEach(PlatformTest.reset);

  describe('listHarvests', () => {
    it('returns a list of Harvest objects', async () => {
      const sett = getSettDefinition(new Ethereum(), TOKENS.BBADGER);
      const token = getToken(sett.depositToken);
      const mockHarvests: HarvestFragment[] = [
        {
          id: '0xfakeTXhash',
          timestamp: Date.now(),
          token: {
            id: token.address,
            name: token.name,
            decimals: token.decimals,
            symbol: token.symbol,
          },
          amount: 0,
          blockNumber: 0,
          strategy: {
            id: '0xstrategyID',
          },
          sett: {
            id: sett.settToken,
          },
        },
      ];
      const mockResponse: HarvestsQuery = {
        settHarvests: mockHarvests,
      };

      jest.spyOn(GraphQLClient.prototype, 'request').mockImplementationOnce(async () => Promise.resolve(mockResponse));

      const { settHarvests } = await service.listHarvests(new Ethereum(), {});
      for (const record of settHarvests) {
        expect(record).toMatchObject({
          id: expect.any(String),
          timestamp: expect.any(Number),
          token: {
            id: expect.any(String),
            name: expect.any(String),
            symbol: expect.any(String),
            decimals: expect.any(Number),
          },
          amount: expect.any(Number),
          blockNumber: expect.any(Number),
          strategy: {
            id: expect.any(String),
          },
          sett: {
            id: expect.any(String),
          },
        });
      }
    });
  });
});
