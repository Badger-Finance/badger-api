import { Currency } from '@badger-dao/sdk';
import { Service } from '@tsed/common';

import { PriceSnapshots } from '../tokens/interfaces/price-snapshots.interface';
import { PriceSummary } from '../tokens/interfaces/price-summary.interface';
import { convert, getPrice, getPriceSnapshotsAtTimestamps } from './prices.utils';

/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
@Service()
export class PricesService {
  async getPriceSummary(tokens: string[], currency?: Currency): Promise<PriceSummary> {
    const prices = await Promise.all(tokens.map(async (token) => getPrice(token)));
    const entries = await Promise.all(
      prices.map(async (tokenPrice) => {
        const convertedPrice = await convert(tokenPrice.price, currency);
        return [tokenPrice.address, convertedPrice];
      }),
    );
    return Object.fromEntries(entries);
  }

  async getPriceSnapshots(tokens: string[], timestamps: number[], currency?: Currency): Promise<PriceSnapshots> {
    const entries = await Promise.all(
      tokens.map(async (t) => {
        const snapshots = await getPriceSnapshotsAtTimestamps(t, timestamps, currency);
        const snapshotEntries = snapshots.map((s) => [s.updatedAt, s.price]);
        return [t, Object.fromEntries(snapshotEntries)];
      }),
    );
    return Object.fromEntries(entries);
  }
}
