import { greaterThanOrEqualTo } from '@aws/dynamodb-expressions';
import { Currency } from '@badger-dao/sdk';
import { ethers } from 'ethers';

import { getDataMapper } from '../aws/dynamodb.utils';
import { TokenPriceSnapshot } from '../aws/models/token-price-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { request } from '../common/request';
import { TOKENS } from '../config/tokens.config';
import { CoinGeckoPriceResponse } from './interface/coingecko-price-response.interface';
import { TokenPrice } from './interface/token-price.interface';

const COINGECKO_URL = 'https://api.coingecko.com/api/v3/simple';

/**
 * Update pricing db entry using chain strategy.
 * @param chain Chain objects
 * @param token Target for price update.
 */
export async function updatePrice({ address, price }: TokenPrice): Promise<TokenPrice> {
  try {
    if (Number.isNaN(price) || price === 0) {
      // TODO: add discord warning logs for errors on pricing
      throw new Error(`Attempting to update ${address} with bad price`);
    }
    const mapper = getDataMapper();
    return mapper.put(
      Object.assign(new TokenPriceSnapshot(), {
        address: ethers.utils.getAddress(address),
        price,
      }),
    );
  } catch (err) {
    console.error(err);
    return { address, price: 0 };
  } // ignore issues to allow for price updates of other coins
}

/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export async function queryPrice(address: string, currency: Currency = Currency.USD): Promise<TokenPrice> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(
      TokenPriceSnapshot,
      { address: ethers.utils.getAddress(address) },
      { limit: 1, scanIndexForward: false },
    )) {
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
      const wethPrice = await queryPrice(TOKENS.WETH);
      return value / wethPrice.price;
    case Currency.AVAX:
      const wavaxPrice = await queryPrice(TOKENS.AVAX_WAVAX);
      return value / wavaxPrice.price;
    case Currency.FTM:
      const wftmPrice = await queryPrice(TOKENS.FTM_WFTM);
      return value / wftmPrice.price;
    case Currency.MATIC:
      const wmaticPrice = await queryPrice(TOKENS.MATIC_WMATIC);
      return value / wmaticPrice.price;
    case Currency.USD:
    default:
      return value;
  }
}

export async function fetchPrices(chain: Chain, inputs: string[], lookupName = false): Promise<CoinGeckoPriceResponse> {
  if (inputs.length === 0) {
    return {};
  }

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

  return request<CoinGeckoPriceResponse>(baseURL, params);
}

export async function getPriceSnapshotsAtTimestamps(
  address: string,
  timestamps: number[],
  currency?: Currency,
): Promise<TokenPriceSnapshot[]> {
  try {
    const snapshots = [];
    const mapper = getDataMapper();

    for (const timestamp of timestamps) {
      for await (const snapshot of mapper.query(
        TokenPriceSnapshot,
        { address: ethers.utils.getAddress(address), updatedAt: greaterThanOrEqualTo(timestamp) },
        { limit: 1 },
      )) {
        snapshot.price = await convert(snapshot.price ?? snapshot.usd, currency);
        snapshot.updatedAt = timestamp;
        snapshots.push(snapshot);
      }
    }

    return snapshots;
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function queryPriceAtTimestamp(
  address: string,
  timestamp: number,
  currency = Currency.USD,
): Promise<TokenPrice> {
  const mapper = getDataMapper();
  for await (const snapshot of mapper.query(
    TokenPriceSnapshot,
    { address: ethers.utils.getAddress(address), updatedAt: greaterThanOrEqualTo(timestamp) },
    { limit: 1 },
  )) {
    snapshot.price = await convert(snapshot.price ?? snapshot.usd, currency);
    return snapshot;
  }
  return queryPrice(address, currency);
}
