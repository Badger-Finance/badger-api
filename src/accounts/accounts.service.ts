import { Inject, Service } from '@tsed/di';
import { BadRequest, InternalServerError, NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../chains/config/chain.config';
import { getSdk, OrderDirection } from '../graphql/generated/badger';
import { PricesService } from '../prices/prices.service';
import { TokenRequest } from '../tokens/interfaces/token-request.interface';
import { TokensService } from '../tokens/tokens.service';
import { Account } from './interfaces/account.interface';

@Service()
export class AccountsService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  tokensService!: TokensService;

  /**
   * Retrieve a user's account details. This includes all positions in setts,
   * the individual earnings from each sett, and claimed amounts of Badger /
   * Digg per sett.
   *
   * @param userId User ethereum account address
   */
  async getAccount(chain: Chain, userId: string): Promise<Account> {
    if (!userId) {
      throw new BadRequest('userId is required');
    }

    const badgerGraphqlClient = new GraphQLClient(chain.graphUrl);
    const badgerGraphqlSdk = getSdk(badgerGraphqlClient);

    // TheGraph address are all lower case, this is required
    const { user } = await badgerGraphqlSdk.User({
      id: userId.toLowerCase(),
      orderDirection: OrderDirection.Asc,
    });

    if (!user) {
      throw new NotFound(`${userId} is not a protocol participant`);
    }

    const userBalances = user.settBalances;
    const settBalances = await Promise.all(
      userBalances.map(async (settBalance) => {
        const sett = settBalance.sett;
        const settDefinition = chain.setts.find((s) => s.settToken.toLowerCase() === settBalance.sett.id);

        // settDefinition should not be undefined - if so there is a config issue
        if (!settDefinition) {
          throw new InternalServerError('Unable to fetch user account');
        }

        let ratio = 1;
        let settPricePerFullShare = parseInt(sett.pricePerFullShare) / 1e18;
        if (settDefinition.symbol.toLowerCase() === 'digg') {
          ratio = sett.balance / sett.totalSupply / settPricePerFullShare;
          settPricePerFullShare = sett.balance / sett.totalSupply;
        }
        const netShareDeposit = parseInt(settBalance.netShareDeposit);
        const grossDeposit = parseInt(settBalance.grossDeposit) * ratio;
        const grossWithdraw = parseInt(settBalance.grossWithdraw) * ratio;
        const settTokens = settPricePerFullShare * netShareDeposit;
        const earned = (settTokens - grossDeposit + grossWithdraw) / Math.pow(10, sett.token.decimals);
        const balance = settTokens / Math.pow(10, sett.token.decimals);

        const earnedTokenRequest: TokenRequest = {
          chain: chain,
          sett: settDefinition,
          balance: earned,
          // currency: currency,
        };
        const balanceTokenRequest: TokenRequest = {
          chain: chain,
          sett: settDefinition,
          balance: balance,
          // currency: currency,
        };
        const [earnedUsd, balanceUsd, earnedTokens, balanceTokens] = await Promise.all([
          this.pricesService.getValue(sett.token.id, earned),
          this.pricesService.getValue(sett.token.id, balance),
          this.tokensService.getSettTokens(earnedTokenRequest),
          this.tokensService.getSettTokens(balanceTokenRequest),
        ]);

        return {
          id: settDefinition.settToken,
          name: settDefinition.name,
          asset: settDefinition.symbol,
          value: balanceUsd,
          earnedValue: earnedUsd,
          earnedTokens: earnedTokens,
          balance: balanceTokens,
        };
      }),
    );

    const accountValue = settBalances.map((b) => b.value).reduce((total, value) => (total += value));
    const accountEarnedValue = settBalances.map((b) => b.earnedValue).reduce((total, value) => (total += value));
    return {
      id: userId,
      value: accountValue,
      earnedValue: accountEarnedValue,
      balances: settBalances,
    };
  }
}
