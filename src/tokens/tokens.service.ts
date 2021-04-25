import { Inject, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { CacheService } from '../cache/CacheService';
import { PANCAKESWAP_URL, Protocol, SUSHISWAP_URL, UNISWAP_URL } from '../config/constants';
import { getSdk as getUniV2Sdk, Sdk as UniV2GraphqlSdk, UniV2PairQuery } from '../graphql/generated/uniswap';
import { PricesService } from '../prices/prices.service';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { TokenBalance } from './interfaces/token-balance.interface';
import { TokenRequest } from './interfaces/token-request.interface';
import { getToken } from './tokens-util';

@Service()
export class TokensService {
  @Inject()
  pricesService!: PricesService;
  @Inject()
  cacheService!: CacheService;

  private sushiswapGraphqlSdk: UniV2GraphqlSdk;
  private uniswapGraphqlSdk: UniV2GraphqlSdk;
  private pancakeswapGraphqlSdk: UniV2GraphqlSdk;

  constructor() {
    const sushiswapGraphqlClient = new GraphQLClient(SUSHISWAP_URL);
    this.sushiswapGraphqlSdk = getUniV2Sdk(sushiswapGraphqlClient);
    const uniswapGraphqlClient = new GraphQLClient(UNISWAP_URL);
    this.uniswapGraphqlSdk = getUniV2Sdk(uniswapGraphqlClient);
    const pancakeswapGraphqlClient = new GraphQLClient(PANCAKESWAP_URL);
    this.pancakeswapGraphqlSdk = getUniV2Sdk(pancakeswapGraphqlClient);
  }

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
    if (token.lpToken) {
      const tokens = await this.getLiquidtyPoolTokenBalances(request);
      return tokens;
    }
    const tokens = [
      {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        balance: balance,
        value: await this.pricesService.getValue(token.address, balance, currency),
      },
    ];
    return tokens;
  }

  async getLiquidtyPoolTokenBalances(request: TokenRequest): Promise<TokenBalance[]> {
    const { sett, balance, currency } = request;
    const { depositToken, protocol } = sett;

    const pairId = depositToken.toLowerCase();
    let poolData: UniV2PairQuery | undefined;
    if (protocol === Protocol.Uniswap) {
      poolData = await this.uniswapGraphqlSdk.UniV2Pair({
        id: pairId,
      });
    }
    if (protocol === Protocol.Sushiswap) {
      poolData = await this.sushiswapGraphqlSdk.UniV2Pair({
        id: pairId,
      });
    }
    if (protocol === Protocol.Pancakeswap) {
      poolData = await this.pancakeswapGraphqlSdk.UniV2Pair({
        id: pairId,
      });
    }

    if (!poolData) {
      throw new NotFound(`${protocol} pool ${pairId} does not exist`);
    }
    const { pair } = poolData;
    if (!pair || protocol === Protocol.Pancakeswap) {
      return this.getOnChainLiquidtyPoolTokenBalances(request);
    }

    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const valueScalar = pair.totalSupply > 0 ? balance / pair.totalSupply : 0;
    const token0: TokenBalance = {
      name: pair.token0.name,
      address: pair.token0.id,
      symbol: pair.token0.symbol,
      decimals: pair.token0.decimals,
      balance: pair.reserve0 * valueScalar,
      value: (await this.pricesService.getValue(pair.token0.id, pair.reserve0, currency)) * valueScalar,
    };
    const token1: TokenBalance = {
      name: pair.token1.name,
      address: pair.token1.id,
      symbol: pair.token1.symbol,
      decimals: pair.token1.decimals,
      balance: pair.reserve1 * valueScalar,
      value: (await this.pricesService.getValue(pair.token1.id, pair.reserve1, currency)) * valueScalar,
    };
    return [token0, token1];
  }

  async getOnChainLiquidtyPoolTokenBalances(request: TokenRequest): Promise<TokenBalance[]> {
    const { chain, sett, balance, currency } = request;
    try {
      const liquidityData = await getLiquidityData(chain, sett.depositToken);

      const { token0, token1, reserve0, reserve1, totalSupply } = liquidityData;
      const t0Token = getToken(token0);
      const t1Token = getToken(token1);

      // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
      const valueScalar = totalSupply > 0 ? balance / totalSupply : 0;
      const token0Balance: TokenBalance = {
        name: t0Token.name,
        address: t0Token.address,
        symbol: t0Token.symbol,
        decimals: t0Token.decimals,
        balance: reserve0 * valueScalar,
        value: (await this.pricesService.getValue(t0Token.address, reserve0, currency)) * valueScalar,
      };
      const token1Balance: TokenBalance = {
        name: t1Token.name,
        address: t1Token.address,
        symbol: t1Token.symbol,
        decimals: t1Token.decimals,
        balance: reserve1 * valueScalar,
        value: (await this.pricesService.getValue(t1Token.address, reserve1, currency)) * valueScalar,
      };
      return [token0Balance, token1Balance];
    } catch (err) {
      throw new NotFound(`${sett.protocol} pool pair ${sett.depositToken} does not exist`);
    }
  }
}
