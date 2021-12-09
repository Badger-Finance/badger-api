import { Account } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { ProofsService } from './proofs.service';

describe('accounts.service', () => {
  const chain = new Ethereum();
  let service: ProofsService;
  let result: Account;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<ProofsService>(ProofsService);
  });

  beforeEach(async () => {});

  afterEach(PlatformTest.reset);

  describe('getAccount', () => {
    it('returns the expected account', () => {
      expect(result).toMatchSnapshot();
    });
  });
});
