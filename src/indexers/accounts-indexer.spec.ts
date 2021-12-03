import accountIndexer from './accounts-indexer';
import { IndexMode } from './accounts-indexer';
import { TEST_ADDR } from '../test/tests.utils';
import * as accountsUtils from '../accounts/accounts.utils';

describe('accounts-indexer', () => {
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
      jest.spyOn(accountsUtils, 'getAccounts').mockImplementation(() => Promise.resolve([TEST_ADDR]));
      await accountIndexer.refreshUserAccounts({ mode: IndexMode.ClaimableBalanceData });
      const chainCallData = refreshAccounts.mock.calls.flatMap((calls) => calls[0].name);
      expect(chainCallData).toEqual(['Ethereum', 'BinanceSmartChain', 'Polygon', 'Arbitrum']);
    });
  });
});
