import { Account } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { Chain } from '../chains/config/chain.config';
import { Ethereum } from '../chains/config/eth.config';
import * as accountIndexer from '../indexer/accounts-indexer';
import { IndexMode } from '../indexer/accounts-indexer';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { AccountsService } from './accounts.service';
import * as accountsUtils from './accounts.utils';

describe('charts.service', () => {
  const chain = new Ethereum();
  let service: AccountsService;
  let result: Account;
  let refreshAccounts: jest.SpyInstance<Promise<void>, [chain: Chain[], mode: IndexMode, accounts: string[]]>;

  const defaultAccount = {
    address: TEST_ADDR,
    boost: 2000,
    boostRank: 3,
    multipliers: [],
    value: 320232,
    earnedValue: 2312,
    data: [],
    claimableBalances: [],
    nativeBalance: 2033222,
    nonNativeBalance: 23129,
  };

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<AccountsService>(AccountsService);
  });

  beforeEach(async () => {
    refreshAccounts = jest.spyOn(accountIndexer, 'refreshAccounts').mockImplementation(() => Promise.resolve());
    setupMapper([defaultAccount]);
    jest.spyOn(accountsUtils, 'getCachedBoost').mockImplementation(async () => ({
      leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
      address: TEST_ADDR,
      rank: 3,
      boost: 2000,
      stakeRatio: 1,
      nftMultiplier: 1,
      nativeBalance: 2033222,
      nonNativeBalance: 23129,
    }));
    result = await service.getAccount(chain, TEST_ADDR);
  });

  afterEach(PlatformTest.reset);

  describe('getAccount', () => {
    it('calls refresh account on requested address', () => {
      const requestedAddresses = refreshAccounts.mock.calls.flatMap((calls) => calls[2]);
      expect(requestedAddresses).toEqual([TEST_ADDR]);
    });
    it('returns the expected account', () => {
      const expectedAccount = {
        ...defaultAccount,
        multipliers: {},
        claimableBalances: {},
        data: {},
      };
      expect(result).toMatchObject(expectedAccount);
    });
  });
});
