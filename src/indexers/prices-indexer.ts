import { Network } from '@badger-dao/sdk';

import { getSupportedChains } from '../chains/chains.utils';
import { Chain } from '../chains/config/chain.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { CoinGeckoPriceResponse } from '../prices/interface/coingecko-price-response.interface';
import { fetchPrices, getPrice, updatePrice } from '../prices/prices.utils';
import { lookUpAddrByTokenName } from '../tokens/tokens.utils';
import { rfw } from '../utils/retry.utils';

export async function indexPrices() {
  for (const chain of getSupportedChains([Network.Ethereum])) {
    try {
      const { tokens } = chain;
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

      const fetchPriceRwf = rfw(fetchPrices);

      // execute price look ups
      const [contractPrices, lookupNamePrices] = await Promise.all([
        fetchPriceRwf(chain, contractTokenAddresses),
        fetchPriceRwf(chain, lookupNames, true),
      ]);
      const onChainPrices = await Promise.all(
        onChainTokens.map(async (t) => {
          try {
            const result = await rfw(getPrice)(chain, t.address);
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
        ...evaluateCoingeckoResponse(chain, contractPrices),
        ...evaluateCoingeckoResponse(chain, lookupNamePrices),
        ...Object.fromEntries(onChainPrices.map((p) => [p.address, p])),
      };

      const persistedPrices = [];
      await Promise.all(
        Object.values(priceUpdates).map(async (p) => {
          try {
            const persisted = await updatePrice(p);
            persistedPrices.push(persisted);
          } catch (err) {
            console.error(err);
          }
        }),
      );

      console.log(
        `Updated ${persistedPrices.length} / ${Object.keys(priceUpdates).length} ${chain.network} token prices`,
      );
    } catch (err) {
      console.error(err);
    }
  }

  return 'done';
}

function evaluateCoingeckoResponse(chain: Chain, result: CoinGeckoPriceResponse) {
  return Object.fromEntries(
    Object.entries(result).map((entry) => {
      const [key, value] = entry;
      const addrByName = lookUpAddrByTokenName(chain, key);
      const address = addrByName || key;
      return [address, { address, price: value.usd }];
    }),
  );
}
