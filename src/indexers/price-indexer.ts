import { loadChains } from '../chains/chain';
import { fetchPrices } from '../prices/coingecko.utils';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { updatePrice } from '../prices/prices.utils';

export async function indexPrices() {
  const chains = loadChains();

  for (const chain of chains) {
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
    const onChainPrices = await Promise.all(onChainTokens.map(async (t) => strategy.getPrice(t.address)));

    const priceUpdates = [...Object.values(contractPrices), ...Object.values(lookupNamePrices), ...onChainPrices];
    await Promise.all(priceUpdates.map(async (p) => updatePrice(p)));
  }
}
