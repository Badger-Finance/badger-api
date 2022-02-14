import { InternalServerError } from '@tsed/exceptions';
import { Chain } from '../chains/config/chain.config';
import { COINGECKO_URL } from '../config/constants';
// TODO: generalize and add some axios utilities
import { request } from '../etherscan/etherscan.utils';
import { PriceData } from '../tokens/interfaces/price-data.interface';
import { getToken, getTokenByName } from '../tokens/tokens.utils';
import { CoinGeckoPriceResponse } from './interface/coingecko-price-response.interface';
import { TokenPrice } from './interface/token-price.interface';

export async function fetchPrices(chain: Chain, inputs: string[], lookupName = false): Promise<PriceData> {
  let baseURL;
  let params: Record<string, string>;

  // utilize coingecko name look up api
  if (lookupName) {
    baseURL = `${COINGECKO_URL}/price`;
    params = {
      ids: inputs.join(','),
      vs_currencies: 'usd',
    };
  } else {
    baseURL = `${COINGECKO_URL}/token_price/${chain.network}`;
    params = {
      contract_addresses: inputs.join(','),
      vs_currencies: 'usd',
    };
  }

  const expectedTokens: string[] = [];
  const result = await request<CoinGeckoPriceResponse>(baseURL, params);
  const priceData = Object.fromEntries(
    Object.entries(result).map((entry) => {
      const [key, value] = entry;
      let token;
      try {
        token = getToken(key);
      } catch {
        token = getTokenByName(key);
      }
      const { address } = token;
      expectedTokens.push(address);
      return [address, { address, price: value.usd }];
    }),
  );
  const missingTokens: string[] = [];
  expectedTokens.forEach((input) => {
    if (!priceData[input]) {
      missingTokens.push(input);
    }
  });
  if (missingTokens.length > 0) {
    console.error(`Missing prices for:\n${missingTokens.join('\n')}`);
  }
  return priceData;
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
    vs_currencies: 'usd',
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
