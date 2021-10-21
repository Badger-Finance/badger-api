import { UnprocessableEntity } from '@tsed/exceptions';
import { Chain } from '../../chains/config/chain.config';
import { ethSetts } from '../../chains/config/eth.config';
import { Protocol } from '../../config/enums/protocol.enum';
import { TOKENS } from '../../config/tokens.config';
import { Erc20__factory } from '../../contracts';
import { tokenBalancesToCachedLiquidityPoolTokenBalance } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { getCachedSett } from '../../setts/setts.utils';
import { CachedLiquidityPoolTokenBalance } from '../interfaces/cached-liquidity-pool-token-balance.interface';
import { formatBalance, getToken, toCachedBalance } from '../tokens.utils';

export const getZsDiggTokenBalance = async (chain: Chain, token: string): Promise<CachedLiquidityPoolTokenBalance> => {
  const definition = ethSetts.find((sett) => sett.settToken === token);
  if (!definition) {
    throw new UnprocessableEntity('Cannot get ZsDiggTokenBalance, requires a sett definition');
  }
  const sett = await getCachedSett(definition);

  // get token definitions
  const digg = getToken(TOKENS.DIGG);
  const wbtc = getToken(TOKENS.WBTC);

  // get stabilizer sett balance in digg value
  const { balance, strategy } = sett;
  const depositToken = getToken(definition.depositToken);
  const decimals = definition.balanceDecimals || depositToken.decimals;
  const diggBalance = formatBalance(balance, decimals);

  // check wbtc holding of stabilizer strategy
  const wbtcToken = Erc20__factory.connect(TOKENS.WBTC, chain.provider);
  const wbtcBalance = formatBalance(await wbtcToken.balanceOf(strategy.address), wbtc.decimals);

  // resolve the proper token balances
  const [diggPrice, wbtcPrice] = await Promise.all([getPrice(digg.address), getPrice(wbtc.address)]);
  const diggPerWbtc = wbtcPrice.usd / diggPrice.usd;
  const realDiggBalance = diggBalance - wbtcBalance * diggPerWbtc;
  const cachedTokens = await Promise.all([toCachedBalance(digg, realDiggBalance), toCachedBalance(wbtc, wbtcBalance)]);
  return tokenBalancesToCachedLiquidityPoolTokenBalance(depositToken.address, Protocol.Badger, cachedTokens);
};
