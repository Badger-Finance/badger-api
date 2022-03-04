import { NotFound } from '@tsed/exceptions';
import { BigNumberish, ethers } from 'ethers';
import { getPrice } from '../prices/prices.utils';
import { VaultDefinition } from '../vaults/interfaces/vault-definition.interface';
import { getCachedVault } from '../vaults/vaults.utils';
import { arbitrumTokensConfig } from './config/arbitrum-tokens.config';
import { bscTokensConfig } from './config/bsc-tokens.config';
import { ethTokensConfig } from './config/eth-tokens.config';
import { maticTokensConfig } from './config/polygon-tokens.config';
import { xDaiTokensConfig } from './config/xdai-tokens.config';
import { CachedLiquidityPoolTokenBalance } from './interfaces/cached-liquidity-pool-token-balance.interface';
import { Token as TokenDefinition } from './interfaces/token.interface';
import { Token } from '@badger-dao/sdk';
import { TokenConfig } from './interfaces/token-config.interface';
import { Currency, TokenBalance } from '@badger-dao/sdk';
import { avalancheTokensConfig } from './config/avax-tokens.config';
import { getDataMapper } from '../aws/dynamodb.utils';
import { fantomTokensConfig } from './config/fantom-tokens.config';
import { Chain } from '../chains/config/chain.config';

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
 * Get token information from address.
 * @param contract Token address.
 * @returns Standard ERC20 token information.
 */
export const getToken = (contract: string): TokenDefinition => {
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
export function getTokenByName(chain: Chain, name: string): Token {
  const searchName = name.toLowerCase();
  const token = Object.values(chain.tokens).find(
    (token) => token.name.toLowerCase() === searchName || token.lookupName?.toLowerCase() === searchName,
  );
  if (!token) {
    throw new NotFound(`${name} not supported`);
  }
  return token;
}

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
  vaultDefinition: VaultDefinition,
  balance: number,
  currency?: Currency,
): Promise<TokenBalance[]> {
  const { protocol, depositToken, vaultToken } = vaultDefinition;
  const token = getToken(vaultDefinition.depositToken);
  if (protocol && (token.lpToken || vaultDefinition.getTokenBalance)) {
    const balanceToken = token.lpToken ? depositToken : vaultToken;
    const [cachedSett, cachedTokenBalances] = await Promise.all([
      getCachedVault(vaultDefinition),
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
    return record.tokenBalances;
  }
  return undefined;
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
