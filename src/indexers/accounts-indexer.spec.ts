import * as accountsIndexer from './accounts-indexer';
import * as accountsUtils from '../accounts/accounts.utils';
import * as indexerUtils from './indexer.utils';
import { Network } from '@badger-dao/sdk';
import { AccountIndexMode } from './enums/account-index-mode.enum';

describe('accounts-indexer', () => {
  const networks = [Network.Ethereum, Network.BinanceSmartChain, Network.Polygon, Network.Arbitrum];

  beforeEach(() => {
    // utilize getAccounts as a canary for detecting the network calls being made
    jest.spyOn(accountsUtils, 'getAccounts').mockImplementation((chain) => Promise.resolve([chain.network]));
  });

  describe('refreshUserAccounts', () => {
    it('calls refreshAccountClaimableBalances for each chain separately', async () => {
      const batchRefresh = jest.spyOn(indexerUtils, 'batchRefreshAccounts').mockImplementation(() => Promise.resolve());
      await accountsIndexer.refreshUserAccounts({ mode: AccountIndexMode.ClaimableBalanceData });
      const chainCallData = batchRefresh.mock.calls.flatMap((calls) => calls[0]);
      expect(chainCallData).toEqual(networks);
    });
    it('calls refreshAccountSettBalances for each chain separately', async () => {
      const batchRefresh = jest.spyOn(indexerUtils, 'batchRefreshAccounts').mockImplementation(() => Promise.resolve());
      await accountsIndexer.refreshUserAccounts({ mode: AccountIndexMode.BalanceData });
      const chainCallData = batchRefresh.mock.calls.flatMap((calls) => calls[0]);
      expect(chainCallData).toEqual(networks);
    });
  });
});
