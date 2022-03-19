import { BigNumberish, ethers } from 'ethers';
import { getPrice } from '../prices/prices.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getCachedVault } from '../vaults/vaults.utils';
import { arbitrumTokensConfig } from './config/arbitrum-tokens.config';
import { bscTokensConfig } from './config/bsc-tokens.config';
import { ethTokensConfig } from './config/eth-tokens.config';
import { maticTokensConfig } from './config/polygon-tokens.config';
import { xDaiTokensConfig } from './config/xdai-tokens.config';
import { CachedVaultTokenBalance } from './interfaces/cached-vault-token-balance.interface';
import { Token } from '@badger-dao/sdk';
import { TokenConfig } from './interfaces/token-config.interface';
import { Currency, TokenBalance } from '@badger-dao/sdk';
import { avalancheTokensConfig } from './config/avax-tokens.config';
import { getDataMapper } from '../aws/dynamodb.utils';
import { fantomTokensConfig } from './config/fantom-tokens.config';
import { Chain } from '../chains/config/chain.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { TokenInformationSnapshot } from './interfaces/token-information-snapshot.interface';
import { TokenFull, TokenFullMap } from './interfaces/token-full.interface';
import { TokenNotFound } from './errors/token.error';
import * as thisModule from './tokens.utils';

// map holding all protocol token information across chains
export const protocolTokens: TokenConfig = {
  ...ethTokensConfig,
  ...bscTokensConfig,
  ...maticTokensConfig,
  ...xDaiTokensConfig,
  ...arbitrumTokensConfig,
  ...avalancheTokensConfig,
  ...fantomTokensConfig,
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

export async function toBalance(token: Token, balance: number, currency?: Currency): Promise<TokenBalance> {
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
 * @param vaultDefinition Vault requested.
 * @param balance Balance in wei.
 * @param currency Optional currency denomination.
 * @returns Array of token balances from the Sett.
 */
export async function getVaultTokens(
  chain: Chain,
  vaultDefinition: VaultDefinition,
  balance: number,
  currency?: Currency,
): Promise<TokenBalance[]> {
  const { protocol, vaultToken, depositToken, getTokenBalance } = vaultDefinition;
  const token = await thisModule.getFullToken(chain, vaultToken);

  if (protocol && (token.lpToken || token.type === PricingType.UniV2LP || getTokenBalance)) {
    const [cachedVault, cachedTokenBalances] = await Promise.all([
      getCachedVault(chain, vaultDefinition),
      getCachedTokenBalances(vaultDefinition, currency),
    ]);
    if (cachedTokenBalances) {
      const balanceScalar = cachedVault.balance > 0 ? balance / cachedVault.balance : 0;
      return cachedTokenBalances.map((bal) => {
        bal.balance *= balanceScalar;
        bal.value *= balanceScalar;
        return bal;
      });
    }
  }

  const tokenInfo = await thisModule.getFullToken(chain, depositToken);

  return [await toBalance(tokenInfo, balance, currency)];
}

export async function getCachedTokenBalances(
  vaultDefinition: VaultDefinition,
  currency?: string,
): Promise<TokenBalance[] | undefined> {
  const mapper = getDataMapper();
  for await (const record of mapper.query(
    CachedVaultTokenBalance,
    { vault: vaultDefinition.vaultToken },
    { limit: 1 },
  )) {
    return record.tokenBalances;
  }
  return undefined;
}

export async function getFullToken(chain: Chain, tokenAddr: Token['address']): Promise<TokenFull> {
  const fullTokenMap = await getFullTokens(chain, [tokenAddr]);

  if (!fullTokenMap[tokenAddr]) throw new TokenNotFound(tokenAddr);

  return fullTokenMap[tokenAddr];
}

export async function getFullTokens(chain: Chain, tokensAddr: Token['address'][]): Promise<TokenFullMap> {
  const cachedTokens = await getCachedTokesInfo(tokensAddr);

  const cachedTokensAddr = cachedTokens.map((token) => token.address);

  const tokensCacheMissMatch = tokensAddr.filter((addr) => !cachedTokensAddr.includes(addr));

  if (tokensCacheMissMatch.length === 0) return mergeTokensFullData(chain.tokens, cachedTokens);

  const sdk = await chain.getSdk();
  let tokensInfo: Token[] = [];
  try {
    const sdkTokensInfo = await sdk.tokens.loadTokens(tokensCacheMissMatch);
    tokensInfo = Object.values(sdkTokensInfo);
  } catch (e) {
    console.warn(`Faild to load tokens from chain node ${e}`);
  }

  if (tokensInfo.length > 0) await cacheTokensInfo(tokensInfo);

  const tokensList = tokensInfo.concat(cachedTokens);

  return mergeTokensFullData(chain.tokens, tokensList);
}

export async function getCachedTokesInfo(tokensAddr: Token['address'][]): Promise<Token[]> {
  const mapper = getDataMapper();
  const tokensToGet = tokensAddr.map((addr) => Object.assign(new TokenInformationSnapshot(), { address: addr }));

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

export function mockBalance(token: Token, balance: number, currency?: Currency): TokenBalance {
  const price = parseInt(token.address.slice(0, 4), 16);
  return {
    address: token.address,
    name: token.name,
    symbol: token.symbol,
    decimals: token.decimals,
    balance: balance,
    value: balance * price,
  };
}
