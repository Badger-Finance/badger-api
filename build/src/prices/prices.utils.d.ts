import { Currency } from '@badger-dao/sdk';
import { TokenPriceSnapshot } from '../aws/models/token-price-snapshot.model';
import { Chain } from '../chains/config/chain.config';
import { CoinGeckoPriceResponse } from './interface/coingecko-price-response.interface';
import { TokenPrice } from './interface/token-price.interface';
/**
 * Update pricing db entry using chain strategy.
 * @param chain Chain objects
 * @param token Target for price update.
 */
export declare function updatePrice({ address, price }: TokenPrice): Promise<TokenPrice>;
/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export declare function getPrice(address: string, currency?: Currency): Promise<TokenPrice>;
/**
 * Convert USD value to supported currencies.
 * @param value USD value
 * @param currency Target currency
 * @returns Converted value in target currency
 */
export declare function convert(value: number, currency?: Currency): Promise<number>;
export declare function fetchPrices(chain: Chain, inputs: string[], lookupName?: boolean): Promise<CoinGeckoPriceResponse>;
export declare function getPriceSnapshotsAtTimestamps(address: string, timestamps: number[], currency?: Currency): Promise<TokenPriceSnapshot[]>;
