import { Service } from '@tsed/common';
import { getDataMapper } from '../aws/dynamodb.utils';
import { CachedLiquidityPoolTokenBalance } from './interfaces/cached-liquidity-pool-token-balance.interface';
import { TokenBalance } from './interfaces/token-balance.interface';
import { TokenRequest } from './interfaces/token-request.interface';
import { cachedTokenBalanceToTokenBalance, getToken, toBalance } from './tokens.utils';

@Service()
export class TokensService {
  /**
   * Get token balances within a sett.
   * @param sett Sett requested.
   * @param balance Balance in wei.
   * @param currency Optional currency denomination.
   * @returns Array of token balances from the Sett.
   */
  async getSettTokens(request: TokenRequest): Promise<TokenBalance[]> {
    const { sett, balance, currency } = request;
    const { protocol, depositToken, settToken } = sett;
    const token = getToken(sett.depositToken);
    if (protocol && (token.lpToken || sett.getTokenBalance)) {
      const balanceToken = token.lpToken ? depositToken : settToken;
      const cachedTokenBalances = await this.getCachedTokenBalances(balanceToken, protocol, currency);
      if (cachedTokenBalances) {
        return cachedTokenBalances;
      }
    }
    return Promise.all([toBalance(token, balance, currency)]);
  }

  async getCachedTokenBalances(
    pairId: string,
    protocol: string,
    currency?: string,
  ): Promise<TokenBalance[] | undefined> {
    const mapper = getDataMapper();
    for await (const record of mapper.query(
      CachedLiquidityPoolTokenBalance,
      { pairId, protocol },
      { indexName: 'IndexLiquidityPoolTokenBalancesOnPairIdAndProtocol', limit: 1 },
    )) {
      const tokenBalances = [];
      for (const cachedTokenBalance of record.tokenBalances) {
        tokenBalances.push(cachedTokenBalanceToTokenBalance(cachedTokenBalance, currency));
      }
      return tokenBalances;
    }
    return undefined;
  }
}
