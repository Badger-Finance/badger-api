import { PlatformTest } from '@tsed/common';
import * as s3 from '../aws/s3.utils';
import { RewardsService } from './rewards.service';

describe('RewardsService', () => {
  let service: RewardsService;

  beforeAll(async () => {
    await PlatformTest.create();

    service = PlatformTest.get<RewardsService>(RewardsService);
  });

  afterEach(() => {
    PlatformTest.reset();
  });

  describe('checkBouncerList', () => {
    describe('check an eligible user', () => {
      it('returns user is eligible', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const proofs = JSON.stringify({
          claims: {
            [address]: {},
          },
        });
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(proofs));
        const eligibility = await service.checkBouncerList(address);
        expect(eligibility).toBeDefined();
        expect(eligibility.isEligible).toBeTruthy();
      });
    });

    describe('check an ineligible user', () => {
      it('returns user is not eligible', async () => {
        const address = '0xC257274276a4E539741Ca11b590B9447B26A8051';
        const proofs = JSON.stringify({
          claims: {},
        });
        jest.spyOn(s3, 'getObject').mockImplementationOnce(async () => Promise.resolve(proofs));
        const eligibility = await service.checkBouncerList(address);
        expect(eligibility).toBeDefined();
        expect(eligibility.isEligible).toBeTruthy();
      });
    });
  });
});
