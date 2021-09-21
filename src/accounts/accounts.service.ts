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
import { UnclaimedRewards } from './interfaces/unclaimed-rewards.interface';
import { UserRewardsUnclaimed } from './interfaces/user-rewards-unclaimed.interface';

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

  async getAllUnclaimed(chain: Chain, page: number): Promise<UnclaimedRewards> {
    const pageSize = 500;
    const startIndex = (page - 1) * pageSize;
    const boostFile = await getObject(REWARD_DATA, 'badger-boosts.json');
    const fileContents: BoostData = JSON.parse(boostFile.toString('utf-8'));
    const accounts = Object.keys(fileContents.userData);
    const totalPages = Math.ceil(accounts.length / pageSize);
    if (page > totalPages) {
      throw new BadRequest(`Page ${page} requested, ${chain.name} only has ${totalPages} pages`);
    }

    const endIndex = accounts.length - startIndex < pageSize ? accounts.length - 1 : startIndex + pageSize;

    const cachedRewards: UserRewardsUnclaimed = {};
    accounts.slice(startIndex, endIndex).forEach(async (address: string) => {
      const cachedAccount = await getCachedAccount(address);
      cachedRewards[address] = cachedAccount.claimableBalances;
    });

    console.log('got cached accounts info', cachedRewards);

    const returnValue = {
      page: page,
      rewards: cachedRewards,
    };
    return returnValue;
  }
}
