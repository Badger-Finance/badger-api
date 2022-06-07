import { TOKENS } from '../config/tokens.config';
import { defaultAccount, mockBatchPut, TEST_ADDR } from '../test/tests.utils';
import { batchRefreshAccounts, chunkArray } from './indexer.utils';
import * as accountsUtils from '../accounts/accounts.utils';

describe('indexer.utils', () => {
  describe('chunkArray', () => {
    it('should split into equal chunks', async () => {
      const data = [];
      const arrayLen = 1000;
      const chunkSize = 10;
      for (let i = 0; i < arrayLen; i++) {
        data.push(TEST_ADDR);
      }
      const chunked = chunkArray(data, chunkSize);
      expect(chunked.length).toEqual(10);
      chunked.forEach((chunk) => {
        expect(chunk.length).toEqual(arrayLen / chunkSize);
      });
    });
  });

  describe('batchRefreshAccounts', () => {
    it('performs the batch operation on all accounts', async () => {
      const accounts = Object.keys(TOKENS).sort();
      const getAccounts = jest.spyOn(accountsUtils, 'getAccountMap').mockImplementation(async () =>
        Object.fromEntries(
          accounts.map((a) => {
            return [a, defaultAccount(a)];
          }),
        ),
      );
      mockBatchPut([]);
      const operatedAccounts: string[] = [];
      await batchRefreshAccounts(accounts, (accts) => {
        Object.keys(accts).forEach((a) => operatedAccounts.push(a));
        return [];
      });
      const queriedAccounts = getAccounts.mock.calls.flatMap((c) => c[0]);
      expect(accounts).toMatchObject(queriedAccounts.sort());
      expect(accounts).toMatchObject(operatedAccounts.sort());
    });
  });
});
