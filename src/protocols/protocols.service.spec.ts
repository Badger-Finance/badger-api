import { PlatformTest } from '@tsed/common';
import { QueryOutput } from 'aws-sdk/clients/dynamodb';
import * as dynamoDbUtils from '../aws/dynamodb.utils';
import { CacheService } from '../cache/CacheService';
import { loadChains } from '../chains/chain';
import { ethSetts } from '../chains/config/eth.config';
import { ProtocolsService } from './protocols.service';

describe('ProtocolsService', () => {
  let service: ProtocolsService;

  beforeAll(async () => {
    await PlatformTest.create();
    loadChains();

    service = PlatformTest.get<ProtocolsService>(ProtocolsService);
  });

  afterAll(PlatformTest.reset);

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  describe('getProtocolPerformance', () => {
    describe('with a sett without a protocol', () => {
      it('returns an empty array', async () => {
        const asset = 'badger';
        const settDefinition = ethSetts.find((s) => s.symbol.toLowerCase() === asset.toLowerCase());
        const valueSources = await service.getProtocolPerformance(settDefinition!);
        expect(valueSources).toEqual([]);
      });
    });

    describe('with a sett that has performance recently cached in DynamoDB', () => {
      it('returns the cached value sources', async () => {
        const address = '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545';
        const apy = 0.2387638742723519;
        const harvestable = false;
        const name = 'Curve LP Fees';
        const oneDay = 0.2387638742723519;
        const sevenDay = 0.7173954961724682;
        const thirtyDay = 0.36767706689757595;
        const threeDay = 0.2387638742723519;
        const mockResponse: QueryOutput = {
          Items: [
            {
              address: {
                S: address,
              },
              addressValueSourceType: {
                S: '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545_swap',
              },
              apy: {
                N: apy.toString(),
              },
              harvestable: {
                BOOL: harvestable,
              },
              name: {
                S: name,
              },
              oneDay: {
                N: oneDay.toString(),
              },
              sevenDay: {
                N: sevenDay.toString(),
              },
              thirtyDay: {
                N: thirtyDay.toString(),
              },
              threeDay: {
                N: threeDay.toString(),
              },
              type: {
                S: 'swap',
              },
              updatedAt: {
                N: Date.now().toString(),
              },
            },
          ],
        };
        jest.spyOn(dynamoDbUtils, 'query').mockImplementationOnce(() => Promise.resolve(mockResponse));

        const asset = 'renBTCCRV';
        const settDefinition = ethSetts.find((s) => s.symbol.toLowerCase() === asset.toLowerCase());
        const valueSources = await service.getProtocolPerformance(settDefinition!);
        expect(valueSources.length).toBe(mockResponse.Items!.length);
        expect(valueSources[0]).toMatchObject({
          name,
          apy,
          harvestable,
          performance: {
            oneDay,
            threeDay,
            sevenDay,
            thirtyDay,
          },
        });
      });
    });

    describe('when data is available in the cache', () => {
      it('returns the cached data', async () => {
        const mockValueSources = [
          {
            name: 'Harvest Curve.fi crvRenWBTC',
            apy: 0,
            performance: {
              oneDay: 0,
              threeDay: 0,
              sevenDay: 0,
              thirtyDay: 0,
            },
          },
        ];
        jest.spyOn(dynamoDbUtils, 'query').mockImplementationOnce(() => Promise.resolve({}));
        jest.spyOn(CacheService.prototype, 'get').mockImplementationOnce(() => mockValueSources);

        const asset = 'hrenBTCCRV';
        const settDefinition = ethSetts.find((s) => s.symbol.toLowerCase() === asset.toLowerCase());
        const valueSources = await service.getProtocolPerformance(settDefinition!);
        expect(valueSources).toEqual(mockValueSources);
      });
    });
  });
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
});
