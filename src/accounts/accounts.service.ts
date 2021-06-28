import { Inject, Service } from '@tsed/di';
import { BadRequest, InternalServerError } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/constants';
import { getUserLeaderBoardRank } from '../leaderboards/leaderboards.utils';
import { PricesService } from '../prices/prices.service';
import { RewardsService } from '../rewards/rewards.service';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { TokensService } from '../tokens/tokens.service';
import { getToken } from '../tokens/tokens.utils';
import { getCachedAccount, getUserAccount } from './accounts.utils';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  tokensService!: TokensService;
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
    };

    if (user) {
      const userBalances = user.settBalances;
      account.balances = await Promise.all(
        userBalances.map(async (settBalance) => {
          const sett = settBalance.sett;
          const settDefinition = chain.setts.find((s) => s.settToken.toLowerCase() === settBalance.sett.id);

          // settDefinition should not be undefined - if so there is a config issue
          if (!settDefinition) {
            throw new InternalServerError('Unable to fetch user account');
          }
          const settToken = getToken(settDefinition.settToken);

          let ratio = 1;
          let settPricePerFullShare = parseInt(sett.pricePerFullShare) / 1e18;
          if (settDefinition.settToken === TOKENS.DIGG) {
            ratio = sett.balance / sett.totalSupply / settPricePerFullShare;
            settPricePerFullShare = sett.balance / sett.totalSupply;
          }
          const netShareDeposit = parseInt(settBalance.netShareDeposit);
          const grossDeposit = parseInt(settBalance.grossDeposit) * ratio;
          const grossWithdraw = parseInt(settBalance.grossWithdraw) * ratio;
          const settTokens = settPricePerFullShare * netShareDeposit;
          const earnedBalance = (settTokens - grossDeposit + grossWithdraw) / Math.pow(10, sett.token.decimals);
          const balance = settTokens / Math.pow(10, sett.token.decimals);

          const earnedTokenRequest: TokenRequest = {
            chain: chain,
            sett: settDefinition,
            balance: earnedBalance,
          };
          const balanceTokenRequest: TokenRequest = {
            chain: chain,
            sett: settDefinition,
            balance: balance,
          };
          const [earnedValue, value, earnedTokens, tokens] = await Promise.all([
            this.pricesService.getValue(sett.token.id, earnedBalance),
            this.pricesService.getValue(sett.token.id, balance),
            this.tokensService.getSettTokens(earnedTokenRequest),
            this.tokensService.getSettTokens(balanceTokenRequest),
          ]);

          return {
            id: settDefinition.settToken,
            name: settDefinition.name,
            asset: settToken.symbol,
            balance,
            value,
            tokens,
            earnedBalance,
            earnedValue,
            earnedTokens,
          };
        }),
      );
    }

    account.value = account.balances.map((b) => b.value).reduce((total, value) => (total += value), 0);
    account.earnedValue = account.balances.map((b) => b.earnedValue).reduce((total, value) => (total += value), 0);
    return account;
  }
}
