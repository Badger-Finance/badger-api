import { Currency, Token, TokenBalance, TokenValue } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper, getVaultEntityId } from '../aws/dynamodb.utils';
import { Vaultish } from '../aws/interfaces/vaultish.interface';
import { TokenInformationSnapshot } from '../aws/models/token-information-snapshot.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { Chain } from '../chains/config/chain.config';
import { convert, queryPrice } from '../prices/prices.utils';
import { TokenNotFound } from './errors/token.error';
import { TokenFull, TokenFullMap } from './interfaces/token-full.interface';

export async function toBalance(token: Token, balance: number, currency?: Currency): Promise<TokenValue> {
  const { price } = await queryPrice(token.address, currency);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price,
  };
}

export async function getVaultTokens(chain: Chain, vault: Vaultish, currency?: Currency): Promise<TokenValue[]> {
  let tokens: TokenValue[] = [];
  const mapper = getDataMapper();
  const id = getVaultEntityId(chain, vault);
  for await (const record of mapper.query(VaultTokenBalance, { id }, { limit: 1 })) {
    tokens = await Promise.all(
      record.tokenBalances.map(async (b) => ({
        ...b,
        value: await convert(b.value, currency),
      })),
    );
  }
  return tokens;
}

export async function getUserTokens(
  chain: Chain,
  scalar: number,
  vault: Vaultish,
  currency?: Currency,
): Promise<TokenValue[]> {
  let underlyingTokens = await getVaultTokens(chain, vault, currency);
  underlyingTokens = underlyingTokens.map((t) => ({
    ...t,
    balance: t.balance * scalar,
    value: t.value * scalar,
  }));
  return underlyingTokens;
}

export async function getFullToken(chain: Chain, tokenAddr: Token['address']): Promise<TokenFull> {
  const address = ethers.utils.getAddress(tokenAddr);
  const fullTokenMap = await getFullTokens(chain, [address]);

  if (!fullTokenMap[address]) {
    throw new TokenNotFound(address);
  }

  return fullTokenMap[address];
}

export async function getFullTokens(chain: Chain, tokensAddr: Token['address'][]): Promise<TokenFullMap> {
  const cachedTokens = await getCachedTokesInfo(tokensAddr);
  const requestedTokenAddresses = new Set(tokensAddr);
  const validToken = (t: Token) => t.name.length > 0 && t.symbol.length > 0;
  cachedTokens
    .filter((t) => requestedTokenAddresses.has(t.address) || !validToken(t))
    .map((t) => t.address)
    .forEach((t) => requestedTokenAddresses.delete(t));
  const tokensCacheMissMatch = [...requestedTokenAddresses];

  if (tokensCacheMissMatch.length === 0) {
    return mergeTokensFullData(chain.tokens, cachedTokens);
  }

  const sdk = await chain.getSdk();
  const sdkTokensInfo = await sdk.tokens.loadTokens(tokensCacheMissMatch);
  const tokensInfo = Object.values(sdkTokensInfo).filter((t) => validToken(t));

  if (tokensInfo.length > 0) {
    await cacheTokensInfo(tokensInfo);
  }

  const tokensList = tokensInfo.concat(cachedTokens);
  return mergeTokensFullData(chain.tokens, tokensList);
}

export async function getCachedTokesInfo(tokensAddr: Token['address'][]): Promise<Token[]> {
  const mapper = getDataMapper();
  const tokensToGet = tokensAddr.map((addr) =>
    Object.assign(new TokenInformationSnapshot(), { address: ethers.utils.getAddress(addr) }),
  );

  const tokensInfo: Token[] = [];

  try {
    for await (const token of mapper.batchGet(tokensToGet)) {
      tokensInfo.push(token);
    }
  } catch (e) {
    console.warn(`Failed to fetch cached tokens info ${e}`);
  }

  return tokensInfo;
}

export async function cacheTokensInfo(tokens: Token[]): Promise<void> {
  const mapper = getDataMapper();

  const tokensInfoMeta = tokens.map((token) => Object.assign(new TokenInformationSnapshot(), token));

  try {
    for await (const persisted of mapper.batchPut(tokensInfoMeta)) {
      if (!persisted) {
        console.warn('Failed to save token info');
      }
    }
  } catch (e) {
    console.warn(`Failed to save tokens info ${e}`);
  }
}

export function mergeTokensFullData(chainTokens: Chain['tokens'], tokens: Token[]): TokenFullMap {
  const mergedTokensFullData: TokenFullMap = {};

  for (const token of tokens) {
    mergedTokensFullData[token.address] = {
      ...token,
      ...(chainTokens[token.address] || {}),
    };
  }

  return mergedTokensFullData;
}

export function lookUpAddrByTokenName(chain: Chain, name: string): Token['address'] | undefined {
  const tokensWithAddr = Object.keys(chain.tokens).map((address) => ({
    ...chain.tokens[address],
    address,
  }));

  return Object.values(tokensWithAddr).find((token) => token.lookupName === name)?.address;
}

export async function toTokenValue(chain: Chain, t: TokenBalance): Promise<TokenValue> {
  return toBalance(await getFullToken(chain, t.address), t.balance);
}
