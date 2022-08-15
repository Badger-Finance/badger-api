import { PlatformServerless } from '@tsed/platform-serverless';
import { PlatformServerlessTest } from '@tsed/platform-serverless-testing';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { NodataForChainError } from '../errors/allocation/nodata.for.chain.error';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { MOCK_BOUNCER_FILE, TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { ProofsService } from './proofs.service';
import { ProofsV3Controller } from './proofs.v3.controller';

describe('proofs.v3.controller', () => {
  beforeEach(
    PlatformServerlessTest.bootstrap(PlatformServerless, {
      lambda: [ProofsV3Controller]
    })
  );
  afterEach(() => PlatformServerlessTest.reset());

  beforeEach(setupMockChain);

  describe('GET /v3/proofs', () => {
    it('returns 404 for a chain with no bouncer file', async () => {
      jest.spyOn(ProofsService.prototype, 'getBouncerProof').mockImplementation(async (chain) => {
        // simulate no chain path
        throw new NodataForChainError(chain.network);
      });
      const { body, statusCode } = await PlatformServerlessTest.request.get(`/proofs`).query({ address: TEST_ADDR });
      expect(statusCode).toEqual(NetworkStatus.NotFound);
      expect(JSON.parse(body)).toMatchSnapshot();
    });

    it('returns 404 for users not on the bouncer list', async () => {
      const badAddress = TOKENS.BADGER;
      jest.spyOn(ProofsService.prototype, 'getBouncerProof').mockImplementation(async () => {
        // simulate no user proofs path
        throw new NodataForAddrError(`${TEST_ADDR}`);
      });
      const { body, statusCode } = await PlatformServerlessTest.request.get(`/proofs`).query({ address: badAddress });
      expect(statusCode).toEqual(NetworkStatus.NotFound);
      expect(JSON.parse(body)).toMatchSnapshot();
    });

    it('returns 200 and the merkle proof for a user on the bouncer list', async () => {
      jest
        .spyOn(ProofsService.prototype, 'getBouncerProof')
        .mockImplementation(async (_chain: Chain, _address: string) => MOCK_BOUNCER_FILE.claims[TEST_ADDR].proof);
      const { body, statusCode } = await PlatformServerlessTest.request.get(`/proofs`).query({ address: TEST_ADDR });
      expect(statusCode).toEqual(NetworkStatus.Success);
      expect(JSON.parse(body)).toMatchSnapshot();
    });
  });
});
