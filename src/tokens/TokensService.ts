import { Inject, Service } from '@tsed/common';
import { NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../config/chain/chain';
import { PANCAKESWAP_URL, Protocol, SUSHISWAP_URL, UNISWAP_URL } from '../config/constants';
import { getSdk as getUniV2Sdk, Sdk as UniV2GraphqlSdk, UniV2PairQuery } from '../graphql/generated/uniswap';
import { SettDefinition } from '../interface/Sett';
import { SettSnapshot } from '../interface/SettSnapshot';
import { TokenBalance } from '../interface/TokenBalance';
import { PricesService } from '../prices/PricesService';
import { getToken } from './tokens-util';

@Service()
export class TokensService {
  @Inject()
  pricesService!: PricesService;

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
   * @param settAddress Sett contract address
   * @param settBalance Sett token balance
   * @param prices Price data object
   */
  async getSettTokens(chain: Chain, settAddress: string, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
    const sett = chain.setts.find((s) => s.settToken === settAddress);
    if (!sett) throw new NotFound(`${settAddress} is not a known Sett`);
    const token = getToken(sett.depositToken);
    if (token.lpToken) {
      return await this.getLiquidtyPoolTokenBalances(sett, settSnapshot);
    }
    const tokens = settSnapshot.balance / Math.pow(10, token.decimals);
    return [
      {
        address: token.address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        balance: tokens,
        value: await this.pricesService.getUsdValue(token.address, tokens),
      } as TokenBalance,
    ];
  }

  async getLiquidtyPoolTokenBalances(sett: SettDefinition, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
    const { depositToken, protocol } = sett;

    let poolData: UniV2PairQuery | undefined;
    if (protocol === Protocol.Uniswap) {
      poolData = await this.uniswapGraphqlSdk.UniV2Pair({
        id: depositToken.toLowerCase(),
      });
    }
    if (protocol === Protocol.Sushiswap) {
      poolData = await this.sushiswapGraphqlSdk.UniV2Pair({
        id: depositToken.toLowerCase(),
      });
    }
    if (protocol === Protocol.Pancakeswap) {
      poolData = await this.pancakeswapGraphqlSdk.UniV2Pair({
        id: depositToken.toLowerCase(),
      });
    }

    if (!poolData) {
      throw new NotFound(`${protocol} pool ${depositToken} does not exist`);
    }
    const { pair } = poolData;
    if (!pair) {
      throw new NotFound(`${protocol} pool ${depositToken} pair does not exist`);
    }
    // poolData returns the full liquidity pool, valueScalar acts to calculate the portion within the sett
    const valueScalar = (settSnapshot.supply * settSnapshot.ratio) / pair.totalSupply;
    const token0: TokenBalance = {
      name: pair.token0.name,
      address: pair.token0.id,
      symbol: pair.token0.symbol,
      decimals: pair.token0.decimals,
      balance: pair.reserve0,
      value: (await this.pricesService.getUsdValue(pair.token0.id, pair.reserve0)) * valueScalar,
    };
    const token1: TokenBalance = {
      name: pair.token1.name,
      address: pair.token1.id,
      symbol: pair.token1.symbol,
      decimals: pair.token1.decimals,
      balance: pair.reserve1,
      value: (await this.pricesService.getUsdValue(pair.token1.id, pair.reserve1)) * valueScalar,
    };
    return [token0, token1];
  }
}
