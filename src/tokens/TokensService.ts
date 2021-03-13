import { Inject, Service } from '@tsed/common';
import { InternalServerError, NotFound } from '@tsed/exceptions';
import { GraphQLClient } from 'graphql-request';
import { Chain } from '../config/chain';
import { SUSHISWAP_URL, TOKENS, UNISWAP_URL } from '../config/constants';
import {
  getSdk as getSushiswapSdk,
  Sdk as SushiswapGraphqlSdk,
  SushiswapPairQuery,
} from '../graphql/generated/sushiswap';
import { getSdk as getUniswapSdk, Sdk as UniswapGraphqlSdk, UniswapPairQuery } from '../graphql/generated/uniswap';
import { SettDefinition } from '../interface/Sett';
import { SettSnapshot } from '../interface/SettSnapshot';
import { Token } from '../interface/Token';
import { TokenBalance } from '../interface/TokenBalance';
import { PricesService } from '../prices/PricesService';

@Service()
export class TokensService {
  @Inject()
  pricesService!: PricesService;

  private sushiswapGraphqlSdk: SushiswapGraphqlSdk;
  private uniswapGraphqlSdk: UniswapGraphqlSdk;

  constructor() {
    const sushiswapGraphqlClient = new GraphQLClient(SUSHISWAP_URL);
    this.sushiswapGraphqlSdk = getSushiswapSdk(sushiswapGraphqlClient);
    const uniswapGraphqlClient = new GraphQLClient(UNISWAP_URL);
    this.uniswapGraphqlSdk = getUniswapSdk(uniswapGraphqlClient);
  }

  /**
   * @param settAddress Sett contract address
   * @param settBalance Sett token balance
   * @param prices Price data object
   */
  async getSettTokens(chain: Chain, settAddress: string, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
    const sett = chain.setts.find((s) => s.settToken === settAddress);
    if (!sett) throw new NotFound(`${settAddress} is not a known Sett`);
    if (this.isLPToken(sett.depositToken)) {
      return await this.getLiquidtyPoolTokenBalances(sett, settSnapshot);
    }
    const tokens = (settSnapshot.balance * settSnapshot.ratio) / 1e18;
    const token = this.getTokenByAddress(sett.depositToken);
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

  getTokenByName(token: string): Token {
    const knownToken = this.tokenRegistry.find((t) => t.name.toLowerCase() === token.toLowerCase());
    if (!knownToken) throw new InternalServerError(`${token} definition not in TokenRegistry`);
    return knownToken;
  }

  getTokenByAddress(token: string): Token {
    const knownToken = this.tokenRegistry.find((t) => t.address.toLowerCase() === token.toLowerCase());
    if (!knownToken) throw new InternalServerError(`${token} definition not in TokenRegistry`);
    return knownToken;
  }

  isLPToken(token: string) {
    return [
      TOKENS.UNI_BADGER_WBTC,
      TOKENS.UNI_DIGG_WBTC,
      TOKENS.SUSHI_BADGER_WBTC,
      TOKENS.SUSHI_DIGG_WBTC,
      TOKENS.SUSHI_ETH_WBTC,
    ].includes(token);
  }

  // TODO: More flexibly look up pools (sushi / uni share subgraph schema)
  async getLiquidtyPoolTokenBalances(sett: SettDefinition, settSnapshot: SettSnapshot): Promise<TokenBalance[]> {
    const { depositToken, protocol } = sett;

    let poolData: SushiswapPairQuery | UniswapPairQuery | undefined;
    if (protocol === 'uniswap') {
      poolData = await this.uniswapGraphqlSdk.UniswapPair({
        id: depositToken.toLowerCase(),
      });
    }
    if (protocol === 'sushiswap') {
      poolData = await this.sushiswapGraphqlSdk.SushiswapPair({
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

  private tokenRegistry: Token[] = [
    {
      address: TOKENS.BADGER,
      name: 'Badger',
      symbol: 'BADGER',
      decimals: 18,
    },
    {
      address: TOKENS.DIGG,
      name: 'Digg',
      symbol: 'DIGG',
      decimals: 9,
    },
    {
      address: TOKENS.SUSHI_DIGG_WBTC,
      name: 'SushiSwap: WBTC-DIGG',
      symbol: 'SushiSwap WBTC/DIGG LP (SLP)',
      decimals: 18,
    },
    {
      address: TOKENS.UNI_DIGG_WBTC,
      name: 'Uniswap V2: WBTC-DIGG',
      symbol: 'Uniswap WBTC/DIGG LP (UNI-V2)',
      decimals: 18,
    },
    {
      address: TOKENS.SUSHI_BADGER_WBTC,
      name: 'SushiSwap: WBTC-BADGER',
      symbol: 'Badger Sett SushiSwap LP Token (bSLP)',
      decimals: 18,
    },
    {
      address: TOKENS.SUSHI_ETH_WBTC,
      name: 'SushiSwap: WBTC-ETH',
      symbol: 'SushiSwap WBTC/ETH LP (SLP)',
      decimals: 18,
    },
    {
      address: TOKENS.UNI_BADGER_WBTC,
      name: 'Uniswap V2: WBTC-BADGER',
      symbol: 'Uniswap WBTC/BADGER LP (UNI-V2)',
      decimals: 18,
    },
    {
      address: TOKENS.CRV_RENBTC,
      name: 'Curve.fi: renCrv Token',
      symbol: 'Curve.fi renBTC/wBTC (crvRenWBTC)',
      decimals: 18,
    },
    {
      address: TOKENS.CRV_TBTC,
      name: 'Curve.fi tBTC/sbtcCrv',
      symbol: 'Curve.fi tBTC/sbtcCrv (tbtc/sbtc)',
      decimals: 18,
    },
    {
      address: TOKENS.CRV_SBTC,
      name: 'Curve.fi renBTC/wBTC/sBTC',
      symbol: 'Curve.fi renBTC/wBTC/sBTC',
      decimals: 18,
    },
  ];
}
