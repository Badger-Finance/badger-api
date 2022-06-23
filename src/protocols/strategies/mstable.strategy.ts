import { formatBalance, Token } from '@badger-dao/sdk';

import { Chain } from '../../chains/config/chain.config';
import { TOKENS } from '../../config/tokens.config';
import { Imbtc__factory, Mhbtc__factory } from '../../contracts';
import { TokenPrice } from '../../prices/interface/token-price.interface';
import { getPrice } from '../../prices/prices.utils';

export async function getImBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const imbtc = Imbtc__factory.connect(token.address, chain.provider);
  const [exchangeRate, mbtcPrice] = await Promise.all([imbtc.exchangeRate(), getPrice(TOKENS.MBTC)]);
  const exchangeRateScalar = formatBalance(exchangeRate);
  return {
    address: token.address,
    price: mbtcPrice.price * exchangeRateScalar,
  };
}

export async function getMhBtcPrice(chain: Chain, token: Token): Promise<TokenPrice> {
  const mhbtc = Mhbtc__factory.connect(token.address, chain.provider);
  const [mbtcPrice, mhbtcPrice, totalSupply] = await Promise.all([
    getPrice(TOKENS.MBTC),
    mhbtc.getPrice(),
    mhbtc.totalSupply(),
  ]);
  const mbtcBalance = formatBalance(mhbtcPrice.k);
  const mhbtcBalance = formatBalance(totalSupply);
  const exchangeRateScalar = mbtcBalance / mhbtcBalance;
  return {
    address: token.address,
    price: mbtcPrice.price * exchangeRateScalar,
  };
}
