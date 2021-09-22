import { Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { getObject } from '../aws/s3.utils';
import { Chain } from '../chains/config/chain.config';
import { REWARD_DATA } from '../config/constants';
import { IndexMode, refreshAccounts } from '../indexer/accounts-indexer';
import { BoostData } from '../rewards/interfaces/boost-data.interface';
import { cachedAccountToAccount, getCachedAccount } from './accounts.utils';
import { Account } from './interfaces/account.interface';
import { CachedAccount } from './interfaces/cached-account.interface';
import { UnclaimedPages } from './interfaces/unclaimed-pages.interface';
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
    return cachedAccountToAccount(cachedAccount, chain.network);
  }

  async getAllUnclaimed(page: number): Promise<UnclaimedRewards> {
    const startIndex = (page - 1) * this.pageSize;
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const fileContents: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const accounts = Object.keys(fileContents.userData);
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
      cachedRewards[result.address] = result.claimableBalances;
    });

    const returnValue = {
      page: page,
      rewards: cachedRewards,
    };
    return returnValue;
  }

  async getUnclaimedPageAmount(): Promise<UnclaimedPages> {
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const fileContents: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const accounts = Object.keys(fileContents.userData);
    return { totalPages: Math.ceil(accounts.length / this.pageSize) };
  }
}
