import { BadRequest, InternalServerError, UnprocessableEntity } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { COINGECKO_URL } from '../config/constants';
import { getCachedVault, getVaultDefinition } from '../vaults/vaults.utils';
import { TokenType } from '../tokens/enums/token-type.enum';
import { PriceData } from '../tokens/interfaces/price-data.interface';
import { TokenConfig } from '../tokens/interfaces/token-config.interface';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokenPriceSnapshot } from '../tokens/interfaces/token-price-snapshot.interface';
import { getToken, getTokenByName } from '../tokens/tokens.utils';
import { request } from '../etherscan/etherscan.utils';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Currency } from '@badger-dao/sdk';
import { TOKENS } from '../config/tokens.config';

export function noPrice(address: string): TokenPriceSnapshot {
  return { address, price: 0, updatedAt: Date.now() };
}

/**
 * Update pricing db entry using chain strategy.
 * @param token Target for price update.
 */
export const updatePrice = async (address: string): Promise<TokenPriceSnapshot> => {
  const strategy = ChainStrategy.getStrategy(address);
  try {
    const { price } = await strategy.getPrice(address);
    if (price === 0) {
      // TODO: add discord warning logs for errors on pricing
      throw new Error('Attempting to update with bad price');
    }
    const mapper = getDataMapper();
    return mapper.put(
      Object.assign(new TokenPriceSnapshot(), {
        address,
        price,
      }),
    );
  } catch (err) {
    return noPrice(address);
  } // ignore issues to allow for price updates of other coins
};

/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export async function getPrice(token: string, currency?: Currency): Promise<TokenPriceSnapshot> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      TokenPriceSnapshot,
      { address: token },
      { limit: 1, scanIndexForward: false },
    )) {
      item.price = await convert(item.price, currency);
      return item;
    }
    return noPrice(token);
  } catch (err) {
    console.error(err);
    return noPrice(token);
  }
}

/**
 * Retrieve all chain token prices in both USD and ETH.
 * @returns Most recently updated token pricing data for all tokens.
 */
export const getPriceData = async (tokens: TokenConfig): Promise<PriceData> => {
  const priceData: PriceData = {};
  const prices = await Promise.all(Object.keys(tokens).map((key) => getPrice(tokens[key].address)));
  prices.forEach((token) => (priceData[token.address] = token));
  return priceData;
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * Warning: Not all contracts are supported.
 * If a token is not supported, but available on CoinGecko, use getTokenPrice.
 * @param contract Token contract address.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getContractPrice = async (contract: string): Promise<TokenPrice> => {
  const params = {
    contract_addresses: contract,
    vs_currencies: 'usd',
  };
  const result = await request<Record<string, { usd: number }>>(`${COINGECKO_URL}/token_price/ethereum`, params);
  const contractKey = contract.toLowerCase(); // coingecko return key in lower case
  if (!result[contractKey] || !result[contractKey].usd) {
    throw new InternalServerError(`Unable to resolve ${contract} price by contract`);
  }
  const token = getToken(contract);
  return {
    address: token.address,
    price: result[contractKey].usd,
  };
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param token CoinGecko token name.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getTokenPrice = async (name: string): Promise<TokenPrice> => {
  const params = {
    ids: name,
    vs_currencies: 'usd,eth',
  };
  const result = await request<Record<string, { usd: number }>>(`${COINGECKO_URL}/price`, params);
  if (!result[name] || !result[name].usd) {
    throw new InternalServerError(`Unable to resolve ${name} price by name`);
  }
  const token = getTokenByName(name);
  return {
    address: token.address,
    price: result[name].usd,
  };
};

/**
 * Get pricing information for a vault token.
 * @param contract Address for vault token.
 * @returns Pricing data for the given vault token based on the pricePerFullShare.
 */
export const getVaultTokenPrice = async (contract: string): Promise<TokenPrice> => {
  const token = getToken(contract);
  if (token.type !== TokenType.Vault) {
    throw new BadRequest(`${token.name} is not a vault token`);
  }
  const { vaultToken } = token;
  if (!vaultToken) {
    throw new UnprocessableEntity(`${token.name} vault token missing`);
  }
  const targetChain = Chain.getChain(vaultToken.network);
  const vaultDefintion = getVaultDefinition(targetChain, token.address);
  const [underlyingTokenPrice, vaultTokenSnapshot] = await Promise.all([
    getPrice(vaultToken.address),
    getCachedVault(vaultDefintion),
  ]);
  return {
    address: token.address,
    price: underlyingTokenPrice.price * vaultTokenSnapshot.pricePerFullShare,
  };
};

export async function convert(value: number, currency?: Currency): Promise<number> {
  if (!currency) {
    return value;
  }
  switch (currency) {
    case Currency.ETH:
      const wethPrice = await getPrice(TOKENS.WETH);
      return value / wethPrice.price;
    case Currency.USD:
    default:
      return value;
  }
}
