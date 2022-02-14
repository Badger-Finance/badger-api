import { InternalServerError } from '@tsed/exceptions';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { COINGECKO_URL } from '../config/constants';
import { TokenPrice } from '../tokens/interfaces/token-price.interface';
import { TokenPriceSnapshot } from '../tokens/interfaces/token-price-snapshot.interface';
import { getToken, getTokenByName } from '../tokens/tokens.utils';
import { request } from '../etherscan/etherscan.utils';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Currency } from '@badger-dao/sdk';
import { TOKENS } from '../config/tokens.config';

/**
 * Update pricing db entry using chain strategy.
 * @param token Target for price update.
 */
export async function updatePrice(address: string): Promise<TokenPrice> {
  const strategy = ChainStrategy.getStrategy(address);
  try {
    const { price } = await strategy.getPrice(address);
    if (price === 0) {
      // TODO: add discord warning logs for errors on pricing
      throw new Error(`Attempting to update ${address} with bad price`);
    }
    const mapper = getDataMapper();
    return mapper.put(
      Object.assign(new TokenPriceSnapshot(), {
        address,
        price,
      }),
    );
  } catch (err) {
    return { address, price: 0 };
  } // ignore issues to allow for price updates of other coins
}

/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export async function getPrice(address: string, currency?: Currency): Promise<TokenPrice> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(TokenPriceSnapshot, { address }, { limit: 1, scanIndexForward: false })) {
      item.price = await convert(item.price, currency);
      return item;
    }
    return { address, price: 0 };
  } catch (err) {
    console.error(err);
    return { address, price: 0 };
  }
}

/**
 * Retrieve the price data for a given token in USD and ETH.
 * Warning: Not all contracts are supported.
 * If a token is not supported, but available on CoinGecko, use getTokenPrice.
 * @param contract Token contract address.
 * @throws {InternalServerError} Failed price lookup.
 */
export async function getContractPrice(contract: string): Promise<TokenPrice> {
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
}

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param token CoinGecko token name.
 * @throws {InternalServerError} Failed price lookup.
 */
export async function getTokenPrice(name: string): Promise<TokenPrice> {
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
}

/**
 * Convert USD value to supported currencies.
 * @param value USD value
 * @param currency Target currency
 * @returns Converted value in target currency
 */
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
