import { DataMapper, QueryIterator, StringToAnyObjectMap } from '@aws/dynamodb-data-mapper';
import { PlatformTest } from '@tsed/common';
import createMockInstance from 'jest-create-mock-instance';
import { loadChains } from '../chains/chain';
import { ethSetts } from '../chains/config/eth.config';
import { CachedValueSource } from './interfaces/cached-value-source.interface';
import { ProtocolsService } from './protocols.service';

describe('ProtocolsService', () => {
  let service: ProtocolsService;

  // Father forgive me for I have sinned
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  const setupMapper = (items: unknown[]) => {
    // @ts-ignore
    const qi: QueryIterator<StringToAnyObjectMap> = createMockInstance(QueryIterator);
    // @ts-ignore
    qi[Symbol.iterator] = jest.fn(() => items.values());
    jest.spyOn(DataMapper.prototype, 'query').mockImplementationOnce(() => qi);
  };
  /* eslint-enable @typescript-eslint/ban-ts-comment */

  beforeAll(async () => {
    await PlatformTest.create();
    loadChains();

    service = PlatformTest.get<ProtocolsService>(ProtocolsService);
  });

  afterAll(PlatformTest.reset);

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  describe('getProtocolPerformance', () => {
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
        const mockResponse = [
          Object.assign(new CachedValueSource(), {
            name,
            address,
            addressValueSourceType: '0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545_swap',
            apy,
            harvestable,
            oneDay,
            threeDay,
            sevenDay,
            thirtyDay,
            type: 'swap',
            updatedAt: Date.now(),
          }),
        ];
        setupMapper(mockResponse);
        const asset = 'renBTCCRV';
        const settDefinition = ethSetts.find((s) => s.symbol.toLowerCase() === asset.toLowerCase());
        const valueSources = await service.getProtocolPerformance(settDefinition!);
        expect(valueSources.length).toBe(mockResponse.length);
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
  });
  /* eslint-enable @typescript-eslint/no-non-null-assertion */
});
