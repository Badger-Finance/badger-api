import { loadChains } from '../chains/chain';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { updatePrice, fetchPrices } from '../prices/prices.utils';

export async function indexPrices() {
  const chains = loadChains();

  for (const chain of chains) {
    try {
      const { tokens, strategy } = chain;
      const chainTokens = Object.values(tokens);

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
            return strategy.getPrice(t.address);
          } catch {
            // ignore pricing error, pass erroneous price downsteam
            return { address: t.address, price: 0 };
          }
        }),
      );

      const priceUpdates = [...Object.values(contractPrices), ...Object.values(lookupNamePrices), ...onChainPrices];
      await Promise.all(
        priceUpdates.map(async (p) => {
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
