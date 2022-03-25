import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { TOKENS } from '../config/tokens.config';
import { PricingType } from '../prices/enums/pricing-type.enum';
import { CoinGeckoPriceResponse } from '../prices/interface/coingecko-price-response.interface';
import { updatePrice, fetchPrices } from '../prices/prices.utils';
import { lookUpAddrByTokenName } from '../tokens/tokens.utils';

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
        ...evaluateCoingeckoResponse(chain, contractPrices),
        ...evaluateCoingeckoResponse(chain, lookupNamePrices),
        ...Object.fromEntries(onChainPrices.map((p) => [p.address, p])),
      };

      // map back unsupported (cross priced) tokens - no cg support or good on chain LP
      for (const t of chainTokens) {
        try {
          // token mapping price is gone - lost in name associated lookup
          if (!priceUpdates[t.address] && t.type === PricingType.LookupName) {
            if (!t.lookupName) {
              throw new Error('Invalid token definition, LookUpName pricing required lookup name');
            }
            const referencePrice = lookupNamePrices[t.lookupName].usd;
            priceUpdates[t.address] = {
              address: t.address,
              price: referencePrice,
            };
          }
        } catch (err) {
          console.error(`Unable to remap ${t.address} to expected look up name ${t.lookupName}`);
        }
      }

      await Promise.all(
        Object.values(priceUpdates).map(async (p) => {
          try {
            if (p.address === TOKENS.BADGER) {
              console.log(p);
            }
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

function evaluateCoingeckoResponse(chain: Chain, result: CoinGeckoPriceResponse) {
  return Object.fromEntries(
    Object.entries(result).map((entry) => {
      const [key, value] = entry;
      const addrByName = lookUpAddrByTokenName(chain, key);
      const address = addrByName || key;
      return [key, { address, price: value.usd }];
    }),
  );
}
