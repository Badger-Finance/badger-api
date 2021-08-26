import { Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { IndexMode, refreshAccounts } from '../indexer/accounts-indexer';
import { cachedAccountToAccount, getCachedAccount } from './accounts.utils';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    let checksumAddress = accountId;
    try {
      checksumAddress = ethers.utils.getAddress(accountId);
    } catch {
      throw new BadRequest(`${accountId} is not a valid account`);
    }
    await refreshAccounts([chain], IndexMode.BalanceData, [checksumAddress]);
    const cachedAccount = await getCachedAccount(checksumAddress);
    return cachedAccountToAccount(cachedAccount, chain.network);
  }
}
