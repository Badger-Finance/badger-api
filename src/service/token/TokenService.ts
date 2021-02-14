import { InternalServerError, NotFound } from "@tsed/exceptions";
import { TokenBalance } from "../../interface/TokenBalance";
import { getSushiswapPair, getUniswapPair, getUsdValue } from "../../util/util";
import { Token } from "../../interface/Token";
import { TOKENS } from "../../util/constants";
import { Service } from "@tsed/common";
import { setts } from "../setts";

/**
 * TODO: Integrate price service with token service,
 * introduce price field under token.
 * TODO: Allow bulk token look ups using parallel price
 * gathering / population of token prices.
 */
@Service()
export class TokenService {

  /**
   * TODO: Create type data type and define here
   * @param settAddress Sett contract address
   * @param settBalance Sett token balance
   * @param prices Price data object
   */
  async getSettTokens(settAddress: string, settBalance: number, prices: any): Promise<TokenBalance[]> {
    const sett = setts.find(s => s.settToken === settAddress);
    if (!sett) throw (new NotFound(`${settAddress} is not a known Sett`));
    if (this.isLPToken(sett.depositToken)) {
      return await this.getLiquidtyPoolTokenBalances(sett.depositToken, sett.protocol, prices);
    }
    const tokens = settBalance / 1e18;
    const token = this.getTokenByAddress(sett.depositToken);
    return [{
      address: token.address,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
      balance: tokens,
      value: getUsdValue(token.address, tokens, prices),
    } as TokenBalance];
  }

  getTokenByName(token: string): Token {
    const knownToken = this.tokenRegistry.find(t => t.name.toLowerCase() === token.toLowerCase());
    if (!knownToken) throw(new InternalServerError(`${token} definition not in TokenRegistry`));
    return knownToken;
  }

  getTokenByAddress(token: string): Token {
    const knownToken = this.tokenRegistry.find(t => t.address.toLowerCase() === token.toLowerCase());
    if (!knownToken) throw(new InternalServerError(`${token} definition not in TokenRegistry`));
    return knownToken;
  }

  isLPToken(token: string) {
    return [
      TOKENS.UNI_BADGER,
      TOKENS.UNI_DIGG,
      TOKENS.SUSHI_BADGER,
      TOKENS.SUSHI_DIGG,
      TOKENS.SUSHI_WBTC,
    ].includes(token);
  }
  
  // TODO: More flexibly look up pools (sushi / uni share subgraph schema)
  async getLiquidtyPoolTokenBalances(poolAddress: string, protocol: string, prices: any): Promise<TokenBalance[]> {
    let poolData;
    if (protocol === 'uniswap') {
      poolData = await getUniswapPair(poolAddress);
    }
    if (protocol === 'sushiswap') {
      poolData = await getSushiswapPair(poolAddress);
    }
    if (!poolData || !poolData.data) {
      throw (new NotFound(`${protocol} pool ${poolAddress} does not exist`));
    }
    const pair = poolData.data.pair;
    const token0: TokenBalance = {
      name: pair.token0.name,
      address: pair.token0.id,
      symbol: pair.token0.symbol,
      decimals: pair.token0.decimals,
      balance: pair.reserve0,
      value: getUsdValue(pair.token0.id, pair.reserve0, prices),
    };
    const token1: TokenBalance = {
      name: pair.token1.name,
      address: pair.token1.id,
      symbol: pair.token1.symbol,
      decimals: pair.token1.decimals,
      balance: pair.reserve1,
      value: getUsdValue(pair.token1.id, pair.reserve1, prices),
    };
    return [token0, token1];
  }

  private tokenRegistry: Token[] = [
    {
      address: TOKENS.BADGER,
      name: "Badger",
      symbol: "BADGER",
      decimals: 18,
    },
    {
      address: TOKENS.DIGG,
      name: "Digg",
      symbol: "DIGG",
      decimals: 9,
    },
    {
      address: TOKENS.SUSHI_DIGG,
      name: "SushiSwap: WBTC-DIGG",
      symbol: "SushiSwap WBTC/DIGG LP (SLP)",
      decimals: 18,
    },
    {
      address: TOKENS.UNI_DIGG,
      name: "Uniswap V2: WBTC-DIGG",
      symbol: "Uniswap WBTC/DIGG LP (UNI-V2)",
      decimals: 18,
    },
    {
      address: TOKENS.SUSHI_BADGER,
      name: "SushiSwap: WBTC-BADGER",
      symbol: "Badger Sett SushiSwap LP Token (bSLP)",
      decimals: 18,
    },
    {
      address: TOKENS.SUSHI_WBTC,
      name: "SushiSwap: WBTC-ETH",
      symbol: "SushiSwap WBTC/ETH LP (SLP)",
      decimals: 18,
    },
    {
      address: TOKENS.UNI_BADGER,
      name: "Uniswap V2: WBTC-BADGER",
      symbol: "Uniswap WBTC/BADGER LP (UNI-V2)",
      decimals: 18,
    },
    {
      address: TOKENS.RENBTC,
      name: "Curve.fi: renCrv Token",
      symbol: "Curve.fi renBTC/wBTC (crvRenWBTC)",
      decimals: 18,
    },
    {
      address: TOKENS.TBTC,
      name: "Curve.fi tBTC/sbtcCrv",
      symbol: "Curve.fi tBTC/sbtcCrv (tbtc/sbtc)",
      decimals: 18,
    },
    {
      address: TOKENS.SBTC,
      name: "Curve.fi renBTC/wBTC/sBTC",
      symbol: "Curve.fi renBTC/wBTC/sBTC",
      decimals: 18,
    },
  ];
}
