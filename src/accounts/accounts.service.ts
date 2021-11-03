import { Account } from '@badger-dao/sdk';
import { Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { IndexMode, refreshAccounts } from '../indexer/accounts-indexer';
import { cachedAccountToAccount, getAccounts, getCachedAccount, getCachedBoost } from './accounts.utils';
import { CachedAccount } from './interfaces/cached-account.interface';
import { UnclaimedRewards } from './interfaces/unclaimed-rewards.interface';
import { UserRewardsUnclaimed } from './interfaces/user-rewards-unclaimed.interface';

@Service()
export class AccountsService {
  private readonly pageSize = 500;

  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    let checksumAddress = accountId;
    try {
      checksumAddress = ethers.utils.getAddress(accountId);
    } catch {
      throw new BadRequest(`${accountId} is not a valid account`);
    }
    await refreshAccounts([chain], IndexMode.BalanceData, [checksumAddress]);
    const cachedAccount = await getCachedAccount(checksumAddress);
    const cachedBoost = await getCachedBoost(chain, checksumAddress);
    cachedAccount.stakeRatio = cachedBoost.stakeRatio;
    cachedAccount.nativeBalance = cachedBoost.nativeBalance;
    cachedAccount.nonNativeBalance = cachedBoost.nonNativeBalance;
    cachedAccount.boost = cachedBoost.boost;
    cachedAccount.boostRank = cachedBoost.rank;
    return cachedAccountToAccount(cachedAccount, chain.network);
  }

  async getAllUnclaimed(chain: Chain, page = 1): Promise<UnclaimedRewards> {
    const startIndex = (page - 1) * this.pageSize;
    const accounts = await getAccounts(chain);
    const totalPages = Math.ceil(accounts.length / this.pageSize);
    if (page > totalPages) {
      throw new BadRequest(`Page ${page} requested, there are only ${totalPages} pages`);
    }

    const endIndex = accounts.length - startIndex < this.pageSize ? accounts.length - 1 : startIndex + this.pageSize;

    const cachedRewards: UserRewardsUnclaimed = {};
    const cachePromises: Promise<CachedAccount>[] = [];
    accounts.slice(startIndex, endIndex).forEach(async (address: string) => {
      cachePromises.push(getCachedAccount(address));
    });

    const results = await Promise.all(cachePromises);
    results.forEach((result) => {
      cachedRewards[result.address] = result.claimableBalances.filter((bal) => bal.network === chain.network);
    });

    const returnValue = {
      page: page,
      maxPage: totalPages,
      rewards: cachedRewards,
    };
    return returnValue;
  }
}
