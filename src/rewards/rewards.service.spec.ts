import { PlatformTest } from '@tsed/common';
import { Forbidden } from '@tsed/exceptions';
import { S3Service } from '../aws/S3Service';
import { CacheService } from '../cache/CacheService';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let s3: S3Service;
  let service: RewardsService;
  let cache: CacheService;

  beforeAll(async () => {
    await PlatformTest.create();

    s3 = PlatformTest.get<S3Service>(S3Service);
    service = PlatformTest.get<RewardsService>(RewardsService);
    cache = PlatformTest.get<CacheService>(CacheService);
  });

  afterEach(() => {
    PlatformTest.reset();
    cache.flush();
  });

  describe('checkBadgerShopEligibility', () => {
    describe('check an eligible user', () => {
      it('completes check successfully', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const addresses = JSON.stringify([address]);
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(addresses));
        await service.checkBadgerShopEligibility(address);
      });
    });

    describe('check an ineligible user', () => {
      it('throws a foribbden error', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const addresses = JSON.stringify([]);
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(addresses));
        await expect(service.checkBadgerShopEligibility(address)).rejects.toThrow(Forbidden);
      });
    });
  });
});
