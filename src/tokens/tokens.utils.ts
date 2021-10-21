import { NotFound } from '@tsed/exceptions';
import { BigNumberish, ethers } from 'ethers';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Chain } from '../chains/config/chain.config';
import { getPrice, inCurrency } from '../prices/prices.utils';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { getCachedSett } from '../setts/setts.utils';
import { arbitrumTokensConfig } from './config/arbitrum-tokens.config';
import { bscTokensConfig } from './config/bsc-tokens.config';
import { ethTokensConfig } from './config/eth-tokens.config';
import { maticTokensConfig } from './config/matic-tokens.config';
import { xDaiTokensConfig } from './config/xdai-tokens.config';
import { CachedLiquidityPoolTokenBalance } from './interfaces/cached-liquidity-pool-token-balance.interface';
import { CachedTokenBalance } from './interfaces/cached-token-balance.interface';
import { Token } from './interfaces/token.interface';
import { TokenConfig } from './interfaces/token-config.interface';
import { TokenPrice } from './interfaces/token-price.interface';
import { TokenBalance } from '@badger-dao/sdk';

// map holding all protocol token information across chains
export const protocolTokens: TokenConfig = {
  ...ethTokensConfig,
  ...bscTokensConfig,
  ...maticTokensConfig,
  ...xDaiTokensConfig,
  ...arbitrumTokensConfig,
};

/**
 * Get token information from address.
 * @param contract Token address.
 * @returns Standard ERC20 token information.
 */
export const getToken = (contract: string): Token => {
  const checksummedAddress = ethers.utils.getAddress(contract);
  const token = protocolTokens[checksummedAddress];
  if (!token) {
    throw new NotFound(`${contract} not supported`);
  }
  return token;
};

/**
 * Get token information from name.
 * @param name Token name.
 * @returns Standard ERC20 token information.
 */
export const getTokenByName = (name: string): Token => {
  const searchName = name.toLowerCase();
  const token = Object.values(protocolTokens).find(
    (token) => token.name.toLowerCase() === searchName || token.lookupName?.toLowerCase() === searchName,
  );
  if (!token) {
    throw new NotFound(`${name} not supported`);
  }
  return token;
};

/**
 * Retrieve tokens that comprise a sett's underlying asset.
 * @param chain Token chain.
 * @param sett Requested sett definition.
 * @returns Array of token definitions comprising requested sett's underlying asset.
 */
export const getSettUnderlyingTokens = async (chain: Chain, sett: SettDefinition): Promise<Token[]> => {
  const depositToken = getToken(sett.depositToken);
  if (depositToken.lpToken) {
    try {
      const { token0, token1 } = await getLiquidityData(chain, sett.depositToken);
      return [getToken(token0), getToken(token1)];
    } catch (err) {
      throw new NotFound(`${sett.protocol} pool pair ${sett.depositToken} does not exist`);
    }
  }
  return [depositToken];
};

/**
 * Convert BigNumber to human readable number.
 * @param value Ethereum wei based big number.
 * @param decimals Decimals for parsing value.
 * @returns Parsed big number from decimals.
 */
export function formatBalance(value: BigNumberish, decimals = 18): number {
  return Number(ethers.utils.formatUnits(value, decimals));
}

/**
 * Convert a cached token balance to a token balance.
 * @param cachedTokenBalance Cached token balance.
 * @param currency Conversion currency.
 * @returns Converted token balance from cached balance.
 */
export function cachedTokenBalanceToTokenBalance(
  cachedTokenBalance: CachedTokenBalance,
  currency?: string,
): TokenBalance {
  const value = currency && currency === 'eth' ? cachedTokenBalance.valueEth : cachedTokenBalance.valueUsd;
  return {
    value,
    address: cachedTokenBalance.address,
    name: cachedTokenBalance.name,
    symbol: cachedTokenBalance.symbol,
    decimals: cachedTokenBalance.decimals,
    balance: cachedTokenBalance.balance,
  };
}

export async function toBalance(token: Token, balance: number, currency?: string): Promise<TokenBalance> {
  const price = await getPrice(token.address);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * inCurrency(price, currency),
  };
}

export async function toCachedBalance(token: Token, balance: number): Promise<CachedTokenBalance> {
  const price = await getPrice(token.address);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    valueUsd: balance * inCurrency(price, 'usd'),
    valueEth: balance * inCurrency(price, 'eth'),
  };
}

/**
 * Get token balances within a sett.
 * @param sett Sett requested.
 * @param balance Balance in wei.
 * @param currency Optional currency denomination.
 * @returns Array of token balances from the Sett.
 */
export async function getSettTokens(sett: SettDefinition, balance: number, currency?: string): Promise<TokenBalance[]> {
  const { protocol, depositToken, settToken } = sett;
  const token = getToken(sett.depositToken);
  if (protocol && (token.lpToken || sett.getTokenBalance)) {
    const balanceToken = token.lpToken ? depositToken : settToken;
    const [cachedSett, cachedTokenBalances] = await Promise.all([
      getCachedSett(sett),
      getCachedTokenBalances(balanceToken, protocol, currency),
    ]);
    if (cachedTokenBalances) {
      const balanceScalar = cachedSett.balance > 0 ? balance / cachedSett.balance : 0;
      return cachedTokenBalances.map((bal) => {
        bal.balance *= balanceScalar;
        bal.value *= balanceScalar;
        return bal;
      });
    }
  }
  return Promise.all([toBalance(token, balance, currency)]);
}

export async function getCachedTokenBalances(
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

export function mockBalance(token: Token, balance: number, currency?: string): TokenBalance {
  const price = parseInt(token.address.slice(0, 4), 16);
  const tokenPrice: TokenPrice = {
    name: token.name,
    address: token.address,
    usd: price,
    eth: price,
  };
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * inCurrency(tokenPrice, currency),
  };
}
