import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';

import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { NodataForAddrError } from '../errors/allocation/nodata.for.addr.error';
import { NodataForChainError } from '../errors/allocation/nodata.for.chain.error';
import { NetworkStatus } from '../errors/enums/network-status.enum';
import { Server } from '../Server';
import { MOCK_BOUNCER_FILE, TEST_ADDR } from '../test/constants';
import { ProofsService } from './proofs.service';

describe('ProofsController', () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let proofsService: ProofsService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    proofsService = PlatformTest.get<ProofsService>(ProofsService);
  });

  afterEach(PlatformTest.reset);

  describe('GET /v3/proofs', () => {
    it('returns 404 for a chain with no bouncer file', async () => {
      jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async (chain) => {
        // simulate no chain path
        throw new NodataForChainError(chain.network);
      });
      const { body } = await request.get(`/v3/proof?address=${TEST_ADDR}`).expect(NetworkStatus.NotFound);
      expect(body).toMatchSnapshot();
    });

    it('returns 404 for users not on the bouncer list', async () => {
      const badAddress = TOKENS.BADGER;
      jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async () => {
        // simulate no user proofs path
        throw new NodataForAddrError(`${TEST_ADDR}`);
      });
      const { body } = await request.get(`/v3/proof?address=${badAddress}`).expect(NetworkStatus.NotFound);
      expect(body).toMatchSnapshot();
    });

    it('returns 200 and the merkle proof for a user on the bouncer list', async () => {
      jest
        .spyOn(proofsService, 'getBouncerProof')
        .mockImplementation(async (_chain: Chain, _address: string) => MOCK_BOUNCER_FILE.claims[TEST_ADDR].proof);
      const { body } = await request.get(`/v3/proof?address=${TEST_ADDR}`).expect(NetworkStatus.Success);
      expect(body).toMatchSnapshot();
    });
  });
});
