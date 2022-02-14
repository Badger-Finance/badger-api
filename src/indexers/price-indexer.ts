import { loadChains } from '../chains/chain';
import { fetchPrices } from '../prices/coingecko.utils';
import { PricingType } from '../prices/enums/pricing-type.enum';

export async function indexPrices() {
  const chains = loadChains();
  const chain = chains[0];
  const { tokens } = chain;
  const chainTokens = Object.values(tokens);
  // const contractTokenAddresses = chainTokens.filter((t) => t.type === PricingType.Contract).map((t) => t.address);
  // const result = await fetchPrices(chain, contractTokenAddresses);
  // console.log(result);
  const lookupNames = chainTokens
    .filter((t) => t.type === PricingType.LookupName)
    .map((t) => t.lookupName)
    .filter((name): name is string => !!name);
  const result = await fetchPrices(chain, lookupNames, true);
  console.log(result);
}
