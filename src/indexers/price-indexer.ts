import { loadChains } from '../chains/chain';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { updatePrice, fetchPrices } from '../prices/prices.utils';
import { getTokenByName } from '../tokens/tokens.utils';

export async function indexPrices() {
  const chains = loadChains();

  for (const chain of chains) {
    try {
      const { tokens, strategy } = chain;
      const chainTokens = Object.entries(tokens).map((e) => ({
        address: e[0],
        ...e[1],
      }));

      // bucket tokens appropriately for coingecko vs. on chain price updates
      const contractTokenAddresses = chainTokens.filter((t) => t.type === PricingType.Contract).map((t) => t.address);
      const lookupNames = chainTokens
        .filter((t) => t.type === PricingType.LookupName)
        .map((t) => t.lookupName)
        .filter((name): name is string => !!name);
      const onChainTokens = chainTokens.filter(
        (t) => t.type !== PricingType.Contract && t.type !== PricingType.LookupName,
      );

      // execute price look ups
      const [contractPrices, lookupNamePrices] = await Promise.all([
        fetchPrices(chain, contractTokenAddresses),
        fetchPrices(chain, lookupNames, true),
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
        }),
      );

      const priceUpdates = {
        ...contractPrices,
        ...lookupNamePrices,
        ...Object.fromEntries(onChainPrices.map((p) => [p.address, p])),
      };

      // map back unsupported (cross priced) tokens - no cg support or good on chain LP
      chainTokens.forEach((t) => {
        try {
          // token mapping price is gone - lost in name associated lookup
          if (!priceUpdates[t.address] && t.type === PricingType.LookupName) {
            if (!t.lookupName) {
              throw new Error('Invalid token definition, LookUpName pricing required lookup name');
            }
            const referenceToken = getTokenByName(chain, t.lookupName);
            const referencePrice = priceUpdates[referenceToken.address];
            priceUpdates[t.address] = {
              address: t.address,
              price: referencePrice.price,
            };
          }
        } catch (err) {
          console.error(`Unable to remap ${t.address} to expected look up name ${t.lookupName}`);
        }
      });

      await Promise.all(
        Object.values(priceUpdates).map(async (p) => {
          try {
            await updatePrice(p);
          } catch (err) {
            console.error(err);
          }
        }),
      );
    } catch (err) {
      console.error(err);
    }
  }
}
