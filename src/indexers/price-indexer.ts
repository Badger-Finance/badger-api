import { loadChains } from '../chains/chain';
import { fetchPrices } from '../prices/coingecko.utils';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { updatePrice } from '../prices/prices.utils';

export async function indexPrices() {
  const chains = loadChains();

  const chain = chains[0];
  const { tokens, strategy } = chain;
  const chainTokens = Object.values(tokens);

  const contractTokenAddresses = chainTokens.filter((t) => t.type === PricingType.Contract).map((t) => t.address);
  const lookupNames = chainTokens
    .filter((t) => t.type === PricingType.LookupName)
    .map((t) => t.lookupName)
    .filter((name): name is string => !!name);
  const [contractPrices, lookupNamePrices] = await Promise.all([
    fetchPrices(chain, contractTokenAddresses),
    fetchPrices(chain, lookupNames, true),
  ]);

  const onChainTokens = chainTokens.filter((t) => t.type !== PricingType.Contract && t.type !== PricingType.LookupName);
  const onChainPrices = await Promise.all(onChainTokens.map(async (t) => strategy.getPrice(t.address)));

  const priceUpdates = [...Object.values(contractPrices), ...Object.values(lookupNamePrices), ...onChainPrices];
  await Promise.all(priceUpdates.map(async (p) => updatePrice(p)));
}
