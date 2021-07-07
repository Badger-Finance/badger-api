import { Inject, Service } from '@tsed/di';
import { BadRequest } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { UserSettBalance } from '../graphql/generated/badger';
import { getUserLeaderBoardRank } from '../leaderboards/leaderboards.utils';
import { PricesService } from '../prices/prices.service';
import { RewardsService } from '../rewards/rewards.service';
import { getCachedAccount, getUserAccount, toSettBalance } from './accounts.utils';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  rewardsService!: RewardsService;

  async getAccount(chain: Chain, accountId: string): Promise<Account> {
    if (!accountId) {
      throw new BadRequest('accountId is required');
    }

    const [accountData, cachedAccount, boostData, boostRank] = await Promise.all([
      getUserAccount(chain, accountId),
      getCachedAccount(accountId),
      this.rewardsService.getUserBoost(accountId),
      getUserLeaderBoardRank(accountId),
    ]);

    const { user } = accountData;
    const claimableBalances = cachedAccount ? cachedAccount.claimableBalances : [];
    const account: Account = {
      id: accountId,
      boost: boostData.boost,
      boostRank,
      multipliers: boostData.multipliers,
      value: 0,
      earnedValue: 0,
      balances: [],
      claimableBalances,
      nativeBalance: boostData.nativeBalance,
      nonNativeBalance: boostData.nonNativeBalance,
    };

    if (user) {
      const userBalances = user.settBalances as UserSettBalance[];
      if (userBalances) {
        const settBalances = userBalances.map(async (settBalance) => toSettBalance(chain, settBalance));
        account.balances = await Promise.all(settBalances);
      }
    }

    account.value = account.balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
    account.earnedValue = account.balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
    return account;
  }
}
