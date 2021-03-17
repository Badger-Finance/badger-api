import { BadRequest, InternalServerError } from '@tsed/exceptions';
import { DocumentClient, QueryInput } from 'aws-sdk/clients/dynamodb';
import { ethers } from 'ethers';
import NodeCache = require('node-cache');
import { getItems, saveItem } from '../aws/dynamodb-utils';
import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { COINGECKO_URL, PRICE_DATA } from '../config/constants';
import { Token } from '../tokens/interfaces/token.interface';
import { PriceData, TokenPrice, TokenPriceSnapshot } from '../tokens/interfaces/token-price.interface';
import { getToken, protocolTokens } from '../tokens/tokens-util';
import { TokenConfig } from '../tokens/types/token-config.type';
import AttributeValue = DocumentClient.AttributeValue;
import fetch from 'node-fetch';

export type PricingFunction = (address: string) => Promise<TokenPrice>;
export interface PriceUpdateRequest {
  [contract: string]: PricingFunction;
}

const priceCache = new NodeCache({ stdTTL: 300, checkperiod: 480 });

export const updatePrice = async (token: Token): Promise<void> => {
  if (!token) {
    throw new BadRequest('Token not supported for pricing');
  }
  const { address, name } = token;
  const strategy = ChainStrategy.getStrategy(address);
  const tokenPriceData = await strategy.getPrice(address);
  tokenPriceData.name = name;
  tokenPriceData.address = address;
  const tokenPriceSnapshot: TokenPriceSnapshot = {
    ...tokenPriceData,
    updatedAt: Date.now(),
  };
  await saveItem(PRICE_DATA, tokenPriceSnapshot);
};

export const updatePrices = async (tokenConfig: TokenConfig): Promise<void> => {
  await Promise.all(Object.values(tokenConfig).map(async (token) => updatePrice(token)));
};

export const getPrice = async (contract: string): Promise<TokenPriceSnapshot> => {
  const checksumContract: AttributeValue = ethers.utils.getAddress(contract);
  const params: QueryInput = {
    TableName: PRICE_DATA,
    KeyConditionExpression: 'address = :address',
    ExpressionAttributeValues: {
      ':address': checksumContract,
    },
    Limit: 1,
    ScanIndexForward: false,
  };
  const prices = await getItems<TokenPriceSnapshot>(params);
  if (!prices || prices.length !== 1) {
    const token = getToken(contract);
    return {
      name: token.name,
      address: token.address,
      usd: 0,
      eth: 0,
      updatedAt: Date.now(),
    };
  }
  return prices[0];
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param contract Token contract address.
 */
export const getTokenPriceData = async (contract: string): Promise<TokenPrice> => {
  const checksumContract = ethers.utils.getAddress(contract);
  const cachedPrice = priceCache.get<TokenPrice>(checksumContract);
  if (!cachedPrice) {
    const priceData = await getPriceData();
    return priceData[checksumContract];
  }
  return cachedPrice;
};

/**
 * Retrieve all chain token prices in both USD and ETH.
 */
export const getPriceData = async (): Promise<PriceData> => {
  const priceData: PriceData = {};
  const prices = await Promise.all(Object.keys(protocolTokens).map((key) => getPrice(protocolTokens[key].address)));
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  prices.forEach((token) => {
    priceData[token.address!] = token;
    priceCache.set(token.address!, token);
  });
  /* eslint-disable @typescript-eslint/no-non-null-assertion */
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
  const cachedPrice: TokenPrice | undefined = priceCache.get(contract);
  if (cachedPrice) return cachedPrice;
  const response = await fetch(
    `${COINGECKO_URL}/token_price/ethereum?contract_addresses=${contract}&vs_currencies=usd,eth`,
  );
  if (!response.ok) throw new InternalServerError(`Unable to query ${contract} price`);
  const json = await response.json();
  const contractKey = contract.toLowerCase(); // coingecko return key in lower case
  if (!json[contractKey] || !json[contractKey].usd || !json[contractKey].eth)
    throw new InternalServerError(`Unable to resolve ${contract} price`);
  const contractPrice: TokenPrice = {
    address: contract,
    usd: json[contractKey].usd,
    eth: json[contractKey].eth,
  };
  priceCache.set(contract, contractPrice);
  return contractPrice;
};

/**
 * Retrieve the price data for a given token in USD and ETH.
 * @param token CoinGecko token name.
 * @throws {InternalServerError} Failed price lookup.
 */
export const getTokenPrice = async (token: string): Promise<TokenPrice> => {
  const cachedPrice: TokenPrice | undefined = priceCache.get(token);
  if (cachedPrice) return cachedPrice;
  const response = await fetch(`${COINGECKO_URL}/price?ids=${token}&vs_currencies=usd,eth`);
  if (!response.ok) throw new InternalServerError(`Unable to query ${token} price`);
  const json = await response.json();
  if (!json[token] || !json[token].usd || !json[token].eth)
    throw new InternalServerError(`Unable to resolve ${token} price`);
  const tokenPrice: TokenPrice = {
    name: token,
    usd: json[token].usd,
    eth: json[token].eth,
  };
  priceCache.set(token, tokenPrice);
  return tokenPrice;
};

export const inCurrency = (tokenPrice: TokenPrice, currency?: string) => {
  switch (currency) {
    case 'eth':
      return tokenPrice.eth;
    case 'usd':
    default:
      return tokenPrice.usd;
  }
};
