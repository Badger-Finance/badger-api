import accountIndexer from './accounts-indexer';
import { IndexMode } from './accounts-indexer';
import { TEST_ADDR } from '../test/tests.utils';
import * as accountsUtils from '../accounts/accounts.utils';
import * as dynamddbUtils from '../aws/dynamodb.utils';
import { CachedAccount } from '../accounts/interfaces/cached-account.interface';

describe('accounts-indexer', () => {
  const defaultAccount: CachedAccount = {
    address: TEST_ADDR,
    boost: 0,
    boostRank: 1,
    multipliers: [],
    value: 0,
    earnedValue: 0,
    balances: [],
    claimableBalances: [],
    stakeRatio: 1,
    nativeBalance: 0,
    nonNativeBalance: 0,
  };
  beforeEach(() => {
    jest.spyOn(accountsUtils, 'getCachedAccount').mockImplementation(() => Promise.resolve(defaultAccount));
    jest.spyOn(accountsUtils, 'getAccounts').mockImplementation(() => Promise.resolve([TEST_ADDR]));
    jest.spyOn(dynamddbUtils, 'getDataMapper').mockImplementation();
  });
  describe('chunkArray', () => {
    it('should split into equal chunks', async () => {
      const data = [];
      const arrayLen = 1000;
      const chunkSize = 10;
      for (let i = 0; i < arrayLen; i++) {
        data.push(TEST_ADDR);
      }
      const chunked = accountIndexer.chunkArray(data, chunkSize);
      expect(chunked.length).toEqual(10);
      chunked.forEach((chunk) => {
        expect(chunk.length).toEqual(arrayLen / chunkSize);
      });
    });
  });
  describe('refreshUserAccounts', () => {
    it('calls refreshAccounts for each chain separately', async () => {
      const refreshAccounts = jest.spyOn(accountIndexer, 'refreshAccounts').mockImplementation(() => Promise.resolve());
      await accountIndexer.refreshUserAccounts({ mode: IndexMode.ClaimableBalanceData });
      const chainCallData = refreshAccounts.mock.calls.flatMap((calls) => calls[0].name);
      expect(chainCallData).toEqual(['Ethereum', 'BinanceSmartChain', 'Polygon', 'Arbitrum']);
    });
    it('calls refreshAccountSettBalances for each chain separately', async () => {
      const refreshAccountClaimableBalances = jest
        .spyOn(accountIndexer, 'refreshAccountClaimableBalances')
        .mockImplementation(() => Promise.resolve());
      await accountIndexer.refreshUserAccounts({ mode: IndexMode.ClaimableBalanceData });
      const chainCallData = refreshAccountClaimableBalances.mock.calls.flatMap((calls) => calls[0].name);
      expect(chainCallData).toEqual(['Ethereum', 'BinanceSmartChain', 'Polygon', 'Arbitrum']);
    });
    it('calls refreshAccountSettBalances for each chain separately', async () => {
      const refreshAccountSettBalances = jest
        .spyOn(accountIndexer, 'refreshAccountSettBalances')
        .mockImplementation(() => Promise.resolve());
      await accountIndexer.refreshUserAccounts({ mode: IndexMode.BalanceData });
      const chainCallData = refreshAccountSettBalances.mock.calls.flatMap((calls) => calls[0].name);
      expect(chainCallData).toEqual(['Ethereum', 'BinanceSmartChain', 'Polygon', 'Arbitrum']);
    });
  });
});
