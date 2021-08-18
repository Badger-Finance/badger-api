import { Service } from '@tsed/di';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { getCachedAccount } from './accounts.utils';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    if (!accountId) {
      throw new BadRequest('accountId is required');
    }
    const cachedAccount = await getCachedAccount(accountId);
    if (!cachedAccount) {
      throw new NotFound(`Account ${accountId} does not exist.`);
    }
    const account: Account = {
      address: cachedAccount.address,
      boost: cachedAccount.boost,
      boostRank: cachedAccount.boostRank,
      multipliers: Object.fromEntries(cachedAccount.multipliers.map((entry) => [entry.address, entry.multiplier])),
      value: 0,
      earnedValue: 0,
      balances: [],
      claimableBalances: cachedAccount.claimableBalances,
      nativeBalance: cachedAccount.nativeBalance,
      nonNativeBalance: cachedAccount.nonNativeBalance,
    };
    account.claimableBalances = account.claimableBalances.filter((balance) => balance.network === chain.network);
    return account;
  }
}
