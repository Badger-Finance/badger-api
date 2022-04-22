import { PlatformTest } from '@tsed/common';
import { CitadelService } from './citadel.service';
import * as treasuryUtils from '../treasury/treasury.utils';
import { treasurySummaryMock } from '../treasury/examples/treasury-summary.mock';
import { mockPricing } from '../test/tests.utils';

import citadelTreasuryMock from '@badger-dao/sdk-mocks/generated/ethereum/api/loadCitadelTreasury.json';
import { getPrice } from '../prices/prices.utils';
import { TOKENS } from '../config/tokens.config';

describe('CitadelService', () => {
  let service: CitadelService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<CitadelService>(CitadelService);
  });
  afterEach(PlatformTest.reset);

  describe('loadTreasurySummary', () => {
    // TODO: incorporate citadel market cap + paid measurements here
    describe('given all available information', () => {
      it('returns a full treasury summary', async () => {
        jest.spyOn(treasuryUtils, 'queryTreasurySummary').mockImplementation(async () => treasurySummaryMock);
        mockPricing();
        const result = await service.loadTreasurySummary();
        const { price } = await getPrice(TOKENS.WBTC);
        citadelTreasuryMock.valueBtc = citadelTreasuryMock.value / price;
        expect(result).toMatchObject(citadelTreasuryMock);
      });
    });
  });
});
