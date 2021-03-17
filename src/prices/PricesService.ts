import { Service } from '@tsed/common';
import { InternalServerError } from '@tsed/exceptions';
import { ethers } from 'ethers';
import NodeCache from 'node-cache';
import fetch from 'node-fetch';
import { COINGECKO_URL } from '../config/constants';
import { PriceData, PriceSummary, TokenPrice } from '../interface/TokenPrice';
import { protocolTokens } from '../tokens/tokens-util';
import { getPrice } from './prices-util';

const priceCache = new NodeCache({ stdTTL: 300, checkperiod: 480 });

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
@Service()
export class PricesService {
  /**
   * Retrieve the USD price for a given token balance.
   * @param contract Token contract address.
   * @param balance Token balance to calculate price.
   */
  async getUsdValue(contract: string, balance: number): Promise<number> {
    const tokenPrice = await this.getTokenPriceData(contract);
    return tokenPrice.usd * balance;
  }

  /**
   * Retrieve the ETH price for a given token balance.
   * @param contract Token contract address.
   * @param balance Token balance to calculate price.
   */
  async getEthValue(contract: string, balance: number): Promise<number> {
    const tokenPrice = await this.getTokenPriceData(contract);
    return tokenPrice.eth * balance;
  }

  /**
   * Retrieve the price data for a given token in USD and ETH.
   * @param contract Token contract address.
   */
  async getTokenPriceData(contract: string): Promise<TokenPrice> {
    const checksumContract = ethers.utils.getAddress(contract);
    const cachedPrice: TokenPrice | undefined = priceCache.get(checksumContract);
    if (!cachedPrice) {
      const priceData = await this.getPriceData();
      return priceData[checksumContract];
    }
    return cachedPrice;
  }

  /**
   * Retrieve all protocol token prices in both USD and ETH.
   */
  async getPriceData(): Promise<PriceData> {
    const priceData: PriceData = {};
    const prices = await Promise.all(protocolTokens.map((token) => getPrice(token.address)));
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    prices.forEach((token) => {
      priceData[token.address!] = token;
      priceCache.set(token.address!, token);
    });
    /* eslint-disable @typescript-eslint/no-non-null-assertion */
    return priceData;
  }

  async getPriceSummary(currency?: string): Promise<PriceSummary> {
    const priceData = await this.getPriceData();
    const priceSummary: PriceSummary = {};
    for (const [key, value] of Object.entries(priceData)) {
      priceSummary[key] = this.inCurrency(value, currency);
    }
    return priceSummary;
  }

  inCurrency(tokenPrice: TokenPrice, currency?: string) {
    switch (currency) {
      case 'eth':
        return tokenPrice.eth;
      case 'usd':
      default:
        return tokenPrice.usd;
    }
  }
}

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
  if (!response.ok) throw new InternalServerError('Unable to query contract price');
  const json = await response.json();
  const contractKey = contract.toLowerCase(); // coingecko return key in lower case
  if (!json[contractKey] || !json[contractKey].usd || !json[contractKey].eth)
    throw new InternalServerError('Unable to resolve contract price');
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
