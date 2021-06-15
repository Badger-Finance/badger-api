import { Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { getDataMapper } from '../aws/dynamodb.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';
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
    const token = getToken(sett.depositToken);
    if (token.lpToken || sett.getTokenBalance) {
      return this.getLiquidityPoolTokenBalances(request);
    }
    return Promise.all([toBalance(token, balance, currency)]);
  }

  async getLiquidityPoolTokenBalances(request: TokenRequest): Promise<TokenBalance[]> {
    const { sett, currency } = request;
    const { depositToken, protocol } = sett;

    if (protocol) {
      const cachedTokenBalances = await this.getCachedTokenBalances(depositToken, protocol, currency);
      if (cachedTokenBalances) {
        return cachedTokenBalances;
      }
    }

    return TokensService.getOnChainLiquidtyPoolTokenBalances(request);
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

  static async getOnChainLiquidtyPoolTokenBalances(request: TokenRequest): Promise<TokenBalance[]> {
    const { chain, sett, balance, currency } = request;
    try {
      const liquidityData = await getLiquidityData(chain, sett.depositToken);

      const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
      const t0Token = getToken(token0);
      const t1Token = getToken(token1);

      // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
      const valueScalar = totalSupply > 0 ? balance / totalSupply : 0;
      const t0TokenBalance = reserve0 * valueScalar;
      const t1TokenBalance = reserve1 * valueScalar;
      return Promise.all([toBalance(t0Token, t0TokenBalance, currency), toBalance(t1Token, t1TokenBalance, currency)]);
    } catch (err) {
      throw new NotFound(`${sett.protocol} pool pair ${sett.depositToken} does not exist`);
    }
  }
}
