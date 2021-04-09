import { PlatformTest } from '@tsed/common';
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

  describe('checkBouncerList', () => {
    describe('check an eligible user', () => {
      it('completes check successfully', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const addresses = JSON.stringify([address]);
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(addresses));
        const eligibility = await service.checkBouncerList(address);
        expect(eligibility).toBeDefined();
        expect(eligibility.isEligible).toBeTruthy();
      });
    });

    describe('check an ineligible user', () => {
      it('throws a foribbden error', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const addresses = JSON.stringify([]);
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(addresses));
        const eligibility = await service.checkBouncerList(address);
        expect(eligibility).toBeDefined();
        expect(eligibility.isEligible).toBeFalsy();
      });
    });
  });
});
