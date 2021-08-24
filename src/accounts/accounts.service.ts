import { Service } from '@tsed/di';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { IndexMode, refreshAccounts } from '../indexer/accounts-indexer';
import { cachedAccountToAccount, getCachedAccount } from './accounts.utils';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    if (!accountId) {
      throw new BadRequest('accountId is required');
    }
    await refreshAccounts([chain], IndexMode.BalanceData, [accountId]);
    const cachedAccount = await getCachedAccount(accountId);
    const account = cachedAccountToAccount(cachedAccount, chain.network);
    if (!account) {
      throw new NotFound(`Account ${accountId} does not exist.`);
    }
    return account;
  }
}
