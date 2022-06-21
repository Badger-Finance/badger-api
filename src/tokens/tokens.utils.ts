import { Currency, Token, TokenValue, VaultDTO } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { TokenInformationSnapshot } from '../aws/models/token-information-snapshot.model';
import { VaultTokenBalance } from '../aws/models/vault-token-balance.model';
import { Chain } from '../chains/config/chain.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { convert, getPrice } from '../prices/prices.utils';
import { SourceType } from '../rewards/enums/source-type.enum';
import { getVaultDefinition } from '../vaults/vaults.utils';
import { TokenNotFound } from './errors/token.error';
import { TokenFull, TokenFullMap } from './interfaces/token-full.interface';
import * as thisModule from './tokens.utils';

export async function toBalance(token: Token, balance: number, currency?: Currency): Promise<TokenValue> {
  const { price } = await getPrice(token.address, currency);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price,
  };
}

/**
 * Get token balances within a vault.
 * @param chain Block chain object
 * @param vault Vault requested.
 * @param balance Balance in wei.
 * @param currency Optional currency denomination.
 * @returns Array of token balances from the Sett.
 */
export async function getVaultTokens(
  chain: Chain,
  vault: VaultDTO,
  balance: number,
  currency?: Currency,
): Promise<TokenValue[]> {
  const tokens = await getCachedTokenBalances(chain, vault, currency);
  const vaultDefinition = getVaultDefinition(chain, vault.vaultToken);
  const { depositToken, getTokenBalance } = vaultDefinition;
  const token = await thisModule.getFullToken(chain, depositToken);

  if (token.lpToken || token.type === PricingType.UniV2LP || getTokenBalance) {
    if (tokens.length > 0) {
      const balanceScalar = vault.balance > 0 ? balance / vault.balance : 0;
      return tokens.map((bal) => {
        bal.balance *= balanceScalar;
        bal.value *= balanceScalar;
        return bal;
      });
    }
  }

  return tokens;
}

export async function getCachedTokenBalances(
  chain: Chain,
  vault: VaultDTO,
  currency?: Currency,
): Promise<TokenValue[]> {
  let tokens: TokenValue[] = [];
  const mapper = getDataMapper();
  for await (const record of mapper.query(VaultTokenBalance, { vault: vault.vaultToken }, { limit: 1 })) {
    tokens = await Promise.all(
      record.tokenBalances.map(async (b) => ({
        ...b,
        value: await convert(b.value, currency),
      })),
    );
  }
  if (tokens.length === 0) {
    const token = await thisModule.getFullToken(chain, vault.underlyingToken);
    tokens = [await toBalance(token, vault.balance, currency)];
  }
  return tokens;
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
      if (!persisted) console.warn('Failed to save token info');
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

export function mockBalance(token: Token, balance: number, currency?: Currency): TokenValue {
  let price = parseInt(token.address.slice(0, 5), 16);
  if (currency && currency !== Currency.USD) {
    price /= 2;
  }
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price,
  };
}

export function tokenEmission(token: Token, boosted = false): string {
  return `${boosted ? 'boosted_' : 'flat_'}${token.symbol}_${SourceType.Emission}`;
}
