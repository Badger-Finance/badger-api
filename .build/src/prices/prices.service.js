"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@tsed/common");
const prices_utils_1 = require("./prices.utils");
/**
 * API price oracle service. Uses CoinGecko as a source of truth for most
 * tokens when possible, and TheGraph for AMM pairs when not available
 * via CG. Prices are cached for 5 minutes at a time, but may live up to 8.
 */
let PricesService = class PricesService {
  async getPriceSummary(tokens, currency) {
    const prices = await Promise.all(tokens.map(async (token) => (0, prices_utils_1.getPrice)(token)));
    const entries = await Promise.all(
      prices.map(async (tokenPrice) => {
        const convertedPrice = await (0, prices_utils_1.convert)(tokenPrice.price, currency);
        return [tokenPrice.address, convertedPrice];
      })
    );
    return Object.fromEntries(entries);
  }
  async getPriceSnapshots(tokens, timestamps, currency) {
    const entries = await Promise.all(
      tokens.map(async (t) => {
        const snapshots = await (0, prices_utils_1.getPriceSnapshotsAtTimestamps)(t, timestamps, currency);
        const snapshotEntries = snapshots.map((s) => [s.updatedAt, s.price]);
        return [t, Object.fromEntries(snapshotEntries)];
      })
    );
    return Object.fromEntries(entries);
  }
};
PricesService = tslib_1.__decorate([(0, common_1.Service)()], PricesService);
exports.PricesService = PricesService;
//# sourceMappingURL=prices.service.js.map
