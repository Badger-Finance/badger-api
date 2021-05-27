import { Inject, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { PANCAKESWAP_URL, Protocol, SUSHISWAP_URL, UNISWAP_URL } from '../config/constants';
import { getSdk as getUniV2Sdk, UniV2PairQuery } from '../graphql/generated/uniswap';
import { PricesService } from '../prices/prices.service';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { TokenBalance } from './interfaces/token-balance.interface';
import { TokenRequest } from './interfaces/token-request.interface';
import { getToken } from './tokens.utils';

@Service()
export class TokensService {
  @Inject()
  pricesService!: PricesService;

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
      const tokens = await this.getLiquidityPoolTokenBalances(request);
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

  async getLiquidityPoolTokenBalances(request: TokenRequest): Promise<TokenBalance[]> {
    const { sett, balance, currency } = request;
    const { depositToken, protocol } = sett;

    const poolData = await TokensService.getPoolData(sett);

    const pairId = depositToken.toLowerCase();
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

  static async getPoolData(settDefinition: SettDefinition): Promise<UniV2PairQuery | undefined> {
    const { depositToken, protocol } = settDefinition;
    const pairId = depositToken.toLowerCase();

    let graphUrl;
    if (protocol === Protocol.Uniswap) {
      graphUrl = UNISWAP_URL;
    } else if (protocol === Protocol.Sushiswap) {
      graphUrl = SUSHISWAP_URL;
    } else if (protocol === Protocol.Pancakeswap) {
      graphUrl = PANCAKESWAP_URL;
    } else {
      return undefined;
    }

    const client = new GraphQLClient(graphUrl);
    const graphqlSdk = getUniV2Sdk(client);
    return graphqlSdk.UniV2Pair({
      id: pairId,
    });
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
