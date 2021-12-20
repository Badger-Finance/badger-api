import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { ProofsService } from './proofs.service';
import * as s3Utils from '../aws/s3.utils';
import { TEST_ADDR } from '../test/tests.utils';
import { MOCK_BOUNCER_FILE } from '../test/constants';
import { TOKENS } from '../config/tokens.config';

describe('proofs.service', () => {
  const chain = new Ethereum();
  let service: ProofsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<ProofsService>(ProofsService);
  });

  afterEach(PlatformTest.reset);

  describe('getBouncerProof', () => {
    it('throws a 404 when a chain is missing a bouncer file', async () => {
      jest.spyOn(s3Utils, 'getObject').mockImplementation();
      await expect(service.getBouncerProof(chain, TEST_ADDR)).rejects.toThrow(
        `${chain.name} does not have a bouncer list`,
      );
    });

    it('throws a 404 when a chain is missing an entry for the user in the bouncer file', async () => {
      jest.spyOn(s3Utils, 'getObject').mockImplementation(async () => JSON.stringify(MOCK_BOUNCER_FILE));
      await expect(service.getBouncerProof(chain, TOKENS.BADGER)).rejects.toThrow(
        `${TOKENS.BADGER} is not on the bouncer list`,
      );
    });

    it('returns the user proof for a user on the bouncer list', async () => {
      jest.spyOn(s3Utils, 'getObject').mockImplementation(async () => JSON.stringify(MOCK_BOUNCER_FILE));
      const result = await service.getBouncerProof(chain, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });
});
