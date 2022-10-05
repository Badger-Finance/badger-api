import { Currency } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { TokenPriceSnapshot } from '../aws/models/token-price-snapshot.model';
import { PriceSnapshots } from '../tokens/interfaces/price-snapshots.interface';
import { PriceSummary } from '../tokens/interfaces/price-summary.interface';
import { queryPrice, queryPriceAtTimestamp } from './prices.utils';

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG.
 */
@Service()
export class PricesService {
  /**
   * Retrieves a full price mapping for all requested tokens.
   * @param tokens requested token prices
   * @param currency requested currency conversion
   * @returns summary of converted token prices where available
   */
  async getPriceSummary(tokens: string[], currency?: Currency): Promise<PriceSummary> {
    const prices = await Promise.all(tokens.map(async (token) => queryPrice(token, currency)));
    return Object.fromEntries(prices.map((p) => [p.address, p.price]));
  }

  /**
   * Fetch price history at timestamps for all tokens at the same timestamps.
   * @param tokens requested token addresses
   * @param timestamps requested timestamps to return
   * @param currency requested currency conversion
   * @returns mapping of tokens from address to a map of timestamps to token prices in currency
   */
  async getPriceSnapshots(tokens: string[], timestamps: number[], currency?: Currency): Promise<PriceSnapshots> {
    const entries = await Promise.all(
      tokens.map(async (t) => {
        const snapshots = await this.#getPriceSnapshotsAtTimestamps(t, timestamps, currency);
        const snapshotEntries = snapshots.map((s) => [s.updatedAt, s.price]);
        return [t, Object.fromEntries(snapshotEntries)];
      }),
    );
    return Object.fromEntries(entries);
  }

  /**
   * Fetch token prices at given timestamps
   * @param address target token address
   * @param timestamps target timestamps for look up
   * @param currency requested currency conversion
   * @returns list of token prices at or nearest to the requested timestamps
   */
  async #getPriceSnapshotsAtTimestamps(
    address: string,
    timestamps: number[],
    currency?: Currency,
  ): Promise<TokenPriceSnapshot[]> {
    try {
      const snapshots = [];

      for (const timestamp of timestamps) {
        const snapshot = await queryPriceAtTimestamp(address, timestamp, currency);
        snapshots.push(snapshot);
      }

      return snapshots;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
}
