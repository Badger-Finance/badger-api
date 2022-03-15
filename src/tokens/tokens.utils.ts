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

// /**
//  * Get token information from name.
//  * @param name Token name.
//  * @returns Standard ERC20 token information.
//  */
// export function getTokenByName(chain: Chain, name: string): Token {
//   const searchName = name.toLowerCase();
//   const token = Object.values(chain.tokens).find(
//     (token) => token.name.toLowerCase() === searchName || token.lookupName?.toLowerCase() === searchName,
//   );
//   if (!token) {
//     throw new NotFound(`${name} not supported`);
//   }
//   return token;
// }

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
  const { protocol, vaultToken, getTokenBalance } = vaultDefinition;
  const token = chain.tokens[vaultToken];
  if (protocol && (token.type === PricingType.UniV2LP || getTokenBalance)) {
    const [cachedVault, cachedTokenBalances] = await Promise.all([
      getCachedVault(vaultDefinition),
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

  const tokenInfo = await getFullToken(chain, vaultToken);

  if (!tokenInfo) return [];

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

export async function getFullToken(chain: Chain, tokenAddr: Token['address']): Promise<TokenFull | null> {
  const fullTokenMap = await getFullTokens(chain, [tokenAddr]);
  return fullTokenMap[tokenAddr] || null;
}

export async function getFullTokens(chain: Chain, tokensAddr: Token['address'][]): Promise<TokenFullMap> {
  const cachedTokens = await getCachedTokesInfo(tokensAddr);
  const cachedTokensAddr = cachedTokens.map((token) => token.address);

  const tokensCacheMissMatch = tokensAddr.filter((addr) => !cachedTokensAddr.includes(addr));

  if (tokensCacheMissMatch.length === 0) return mergeTokensFullData(cachedTokens);

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

  return mergeTokensFullData(tokensList);
}

export async function getCachedTokesInfo(tokensAddr: Token['address'][]): Promise<Token[]> {
  const mapper = getDataMapper();

  const tokensInfo: Token[] = [];

  for (const addr of tokensAddr) {
    try {
      tokensInfo.push(await mapper.get(Object.assign(new TokenInformationSnapshot(), { address: addr })));
    } catch (e) {
      console.log(`Token snapshot not found on addr ${addr} `);
    }
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

export function mergeTokensFullData(tokens: Token[]): TokenFullMap {
  const mergedTokensFullData: TokenFullMap = {};

  for (const token of tokens) {
    mergedTokensFullData[token.address] = {
      ...token,
      ...(protocolTokens[token.address] || {}),
    };
  }

  return mergedTokensFullData;
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
