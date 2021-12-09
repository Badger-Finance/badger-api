import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { ProofsService } from './proofs.service';
import { TEST_ADDR } from '../test/tests.utils';
import { TOKENS } from '../config/tokens.config';
import { MOCK_BOUNCER_FILE } from '../test/constants';
import { NotFound } from '@tsed/exceptions';
import { Ethereum } from '../chains/config/eth.config';
import { Chain } from '../chains/config/chain.config';

describe('ProofsController', () => {
  const chain = new Ethereum();
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let proofsService: ProofsService;

  beforeEach(PlatformTest.bootstrap(Server));
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
    proofsService = PlatformTest.get<ProofsService>(ProofsService);
  });

  afterEach(PlatformTest.reset);

  describe('GET /v2/proofs', () => {
    it('returns 404 for a chain with no bouncer file', async (done: jest.DoneCallback) => {
      jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async () => {
        // simulate no chain path
        throw new NotFound(`${chain.name} does not have a bouncer list`);
      });
      const { body } = await request.get(`/v2/proofs/${TEST_ADDR}`).expect(404);
      expect(body).toMatchSnapshot();
      done();
    });

    it('returns 404 for users not on the bouncer list', async (done: jest.DoneCallback) => {
      const badAddress = TOKENS.BADGER;
      jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async () => {
        // simulate no user proofs path
        throw new NotFound(`${badAddress} is not on the bouncer list`);
      });
      const { body } = await request.get(`/v2/proofs/${badAddress}`).expect(404);
      expect(body).toMatchSnapshot();
      done();
    });

    it('returns 200 and the merkle proof for a user on the bouncer list', async (done: jest.DoneCallback) => {
      jest.spyOn(proofsService, 'getBouncerProof').mockImplementation(async (_chain: Chain, _address: string) => {
        console.log('CALLED MOCKED FN');
        return MOCK_BOUNCER_FILE.claims[TEST_ADDR].proof;
      });
      const { body } = await request.get(`/v2/proofs/${TEST_ADDR}`).expect(200);
      expect(body).toMatchSnapshot();
      done();
    });
  });
});
