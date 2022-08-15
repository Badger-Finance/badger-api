import { Account } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';

import { Chain } from '../chains/config/chain.config';
import { TEST_ADDR } from '../test/constants';
import { setupMockChain } from '../test/mocks.utils';
import { AccountsService } from './accounts.service';
import * as accountsUtils from './accounts.utils';

describe('accounts.service', () => {
  let service: AccountsService;
  let chain: Chain;

  beforeEach(() => {
    chain = setupMockChain();
  });

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<AccountsService>(AccountsService);
  });

  afterEach(PlatformTest.reset);

  describe('getAccount', () => {
    it('returns the expected account', async () => {
      jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(async (_chain, address) => {
        const cachedAccount: Account = {
          address,
          value: 10,
          earnedValue: 1,
          boost: 2000,
          boostRank: 1,
          data: {},
          claimableBalances: {},
          stakeRatio: 1,
          nftBalance: 3,
          bveCvxBalance: 1,
          diggBalance: 1,
          nativeBalance: 5,
          nonNativeBalance: 5,
        };
        return cachedAccount;
      });
      const result = await service.getAccount(chain, TEST_ADDR);
      expect(result).toMatchSnapshot();
    });
  });
});
