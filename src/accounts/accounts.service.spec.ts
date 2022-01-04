import { Account, Network } from '@badger-dao/sdk';
import { PlatformTest } from '@tsed/common';
import { Ethereum } from '../chains/config/eth.config';
import { LeaderBoardType } from '../leaderboards/enums/leaderboard-type.enum';
import { setupMapper, TEST_ADDR } from '../test/tests.utils';
import { AccountsService } from './accounts.service';
import { CachedAccount } from './interfaces/cached-account.interface';
import * as accountsUtils from './accounts.utils';

describe('accounts.service', () => {
  const chain = new Ethereum();
  let service: AccountsService;
  let result: Account;

  const defaultAccount: CachedAccount = {
    address: TEST_ADDR,
    stakeRatio: 1,
    boost: 2000,
    boostRank: 3,
    multipliers: [],
    nftBalance: 1023,
    value: 320232,
    earnedValue: 2312,
    balances: [
      {
        network: Network.Ethereum,
        address: TEST_ADDR,
        name: 'Example Sett Balance',
        symbol: 'bESB',
        balance: 1,
        value: 320232,
        earnedValue: 2312,
        tokens: [],
        earnedTokens: [],
        pricePerFullShare: 1.002,
        earnedBalance: 1,
        withdrawnBalance: 0,
        depositedBalance: 5,
      },
      {
        network: Network.Arbitrum,
        address: TEST_ADDR,
        name: 'Example Sett Balance',
        symbol: 'bESB',
        balance: 1,
        value: 320232,
        earnedValue: 2312,
        tokens: [],
        earnedTokens: [],
        pricePerFullShare: 1.002,
        earnedBalance: 1,
        withdrawnBalance: 0,
        depositedBalance: 5,
      },
    ],
    claimableBalances: [],
    nativeBalance: 2033222,
    nonNativeBalance: 23129,
  };

  beforeAll(async () => {
    await PlatformTest.create();
    service = PlatformTest.get<AccountsService>(AccountsService);
  });

  beforeEach(async () => {
    setupMapper([defaultAccount]);
    jest.spyOn(accountsUtils, 'getCachedBoost').mockImplementation(async () => ({
      leaderboard: `${chain.network}_${LeaderBoardType.BadgerBoost}`,
      address: TEST_ADDR,
      rank: 3,
      boost: 2000,
      stakeRatio: 1,
      nftBalance: 123213,
      nativeBalance: 2033222,
      nonNativeBalance: 23129,
    }));
    result = await service.getAccount(chain, TEST_ADDR);
  });

  afterEach(PlatformTest.reset);

  describe('getAccount', () => {
    it('returns the expected account', () => {
      expect(result).toMatchSnapshot();
    });
  });
});
