import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { TEST_ADDR } from '../test/tests.utils';
import { AccountsService } from './accounts.service';
import * as accountsUtils from './accounts.utils';

describe('accounts.service', () => {
  const chain = new Ethereum();
  let service: AccountsService;

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<AccountsService>(AccountsService);
  });

  afterEach(PlatformTest.reset);

  describe('getAccount', () => {
    it('returns the expected account', async () => {
      jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_chain, address) => ({
        address,
        value: 10,
        earnedValue: 1,
        boost: 2000,
        rank: 1,
        boostRank: 1,
        multipliers: {},
        data: {},
        claimableBalances: {},
        stakeRatio: 1,
        nftBalance: 3,
        bveCvxBalance: 1,
        nativeBalance: 5,
        nonNativeBalance: 5,
      }));
      const result = await service.getAccount(chain, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });
});
