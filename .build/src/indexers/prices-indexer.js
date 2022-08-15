"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexPrices = void 0;
const chain_1 = require("../chains/chain");
const pricing_type_enum_1 = require("../prices/enums/pricing-type.enum");
const prices_utils_1 = require("../prices/prices.utils");
const tokens_utils_1 = require("../tokens/tokens.utils");
async function indexPrices() {
  for (const chain of chain_1.SUPPORTED_CHAINS) {
    try {
      const { tokens, strategy } = chain;
      const chainTokens = Object.entries(tokens).map((e) => ({
        address: e[0],
        ...e[1]
      }));
      // bucket tokens appropriately for coingecko vs. on chain price updates
      const contractTokenAddresses = chainTokens
        .filter((t) => t.type === pricing_type_enum_1.PricingType.Contract)
        .map((t) => t.address);
      const lookupNames = chainTokens
        .filter((t) => t.type === pricing_type_enum_1.PricingType.LookupName)
        .map((t) => t.lookupName)
        .filter((name) => !!name);
      const onChainTokens = chainTokens.filter(
        (t) =>
          t.type !== pricing_type_enum_1.PricingType.Contract && t.type !== pricing_type_enum_1.PricingType.LookupName
      );
      // execute price look ups
      const [contractPrices, lookupNamePrices] = await Promise.all([
        (0, prices_utils_1.fetchPrices)(chain, contractTokenAddresses),
        (0, prices_utils_1.fetchPrices)(chain, lookupNames, true)
      ]);
      const onChainPrices = await Promise.all(
        onChainTokens.map(async (t) => {
          try {
            const result = await strategy.getPrice(t.address);
            // allow catch to handle any issues
            return result;
          } catch (err) {
            console.error(err);
            // ignore pricing error, pass erroneous price downsteam
            return { address: t.address, price: 0 };
          }
        })
      );
      const priceUpdates = {
        ...evaluateCoingeckoResponse(chain, contractPrices),
        ...evaluateCoingeckoResponse(chain, lookupNamePrices),
        ...Object.fromEntries(onChainPrices.map((p) => [p.address, p]))
      };
      const persistedPrices = [];
      await Promise.all(
        Object.values(priceUpdates).map(async (p) => {
          try {
            const persisted = await (0, prices_utils_1.updatePrice)(p);
            persistedPrices.push(persisted);
          } catch (err) {
            console.error(err);
          }
        })
      );
      console.log(
        `Updated ${persistedPrices.length} / ${Object.keys(priceUpdates).length} ${chain.network} token prices`
      );
    } catch (err) {
      console.error(err);
    }
  }
  return "done";
}
exports.indexPrices = indexPrices;
function evaluateCoingeckoResponse(chain, result) {
  return Object.fromEntries(
    Object.entries(result).map((entry) => {
      const [key, value] = entry;
      const addrByName = (0, tokens_utils_1.lookUpAddrByTokenName)(chain, key);
      const address = addrByName || key;
      return [address, { address, price: value.usd }];
    })
  );
}
//# sourceMappingURL=prices-indexer.js.map
