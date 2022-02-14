import { TokenPriceSnapshot } from './interface/token-price-snapshot.interface';
import { getDataMapper } from '../aws/dynamodb.utils';
import { Currency } from '@badger-dao/sdk';
import { TOKENS } from '../config/tokens.config';
import { TokenPrice } from './interface/token-price.interface';

/**
 * Update pricing db entry using chain strategy.
 * @param token Target for price update.
 */
export async function updatePrice({ address, price }: TokenPrice): Promise<TokenPrice> {
  try {
    if (Number.isNaN(price) || price === 0) {
      // TODO: add discord warning logs for errors on pricing
      throw new Error(`Attempting to update ${address} with bad price`);
    }
    const mapper = getDataMapper();
    return mapper.put(
      Object.assign(new TokenPriceSnapshot(), {
        address,
        price,
      }),
    );
  } catch (err) {
    console.error(err);
    return { address, price: 0 };
  } // ignore issues to allow for price updates of other coins
}

/**
 * Load token price fromt he pricing database.
 * @param contract Address for the token price being requested.
 * @returns Most recent price data for the requested contract.
 */
export async function getPrice(address: string, currency?: Currency): Promise<TokenPrice> {
  try {
    const mapper = getDataMapper();
    for await (const item of mapper.query(TokenPriceSnapshot, { address }, { limit: 1, scanIndexForward: false })) {
      item.price = await convert(item.price, currency);
      return item;
    }
    return { address, price: 0 };
  } catch (err) {
    console.error(err);
    return { address, price: 0 };
  }
}

/**
 * Convert USD value to supported currencies.
 * @param value USD value
 * @param currency Target currency
 * @returns Converted value in target currency
 */
export async function convert(value: number, currency?: Currency): Promise<number> {
  if (!currency) {
    return value;
  }
  switch (currency) {
    case Currency.ETH:
      const wethPrice = await getPrice(TOKENS.WETH);
      return value / wethPrice.price;
    case Currency.AVAX:
      const wavaxPrice = await getPrice(TOKENS.AVAX_WAVAX);
      return value / wavaxPrice.price;
    case Currency.USD:
    default:
      return value;
  }
}
