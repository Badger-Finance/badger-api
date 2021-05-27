import { NotFound } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Chain } from '../chains/config/chain.config';
import { getLiquidityData } from '../protocols/common/swap.utils';
import { SettDefinition } from '../setts/interfaces/sett-definition.interface';
import { bscTokensConfig } from './config/bsc-tokens.config';
import { ethTokensConfig } from './config/eth-tokens.config';
import { CachedTokenBalance } from './interfaces/cached-token-balance.interface';
import { Token } from './interfaces/token.interface';
import { TokenBalance } from './interfaces/token-balance.interface';

export const protocolTokens = { ...ethTokensConfig, ...bscTokensConfig };

export const getToken = (contract: string): Token => {
  const checksummedAddress = ethers.utils.getAddress(contract);
  const token = protocolTokens[checksummedAddress];
  if (!token) {
    throw new NotFound(`${contract} not supported`);
  }
  return token;
};

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

export const getSettTokens = async (chain: Chain, sett: SettDefinition): Promise<Token[]> => {
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
