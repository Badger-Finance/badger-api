import { NotFound, UnprocessableEntity } from '@tsed/exceptions';
import { ethers } from 'ethers';
import { Ethereum, ethSetts } from '../../chains/config/eth.config';
import { erc20Abi } from '../../config/abi/erc20.abi';
import { STRATEGIES, TOKENS } from '../../config/constants';
import { Protocol } from '../../config/enums/protocol.enum';
import { tokenBalancesToCachedLiquidityPoolTokenBalance } from '../../indexer/indexer.utils';
import { getPrice } from '../../prices/prices.utils';
import { getSett } from '../../setts/setts.utils';
import { CachedLiquidityPoolTokenBalance } from '../interfaces/cached-liquidity-pool-token-balance.interface';
import { formatBalance, getToken, toCachedBalance } from '../tokens.utils';

export const getZsDiggTokenBalance = async (token: string): Promise<CachedLiquidityPoolTokenBalance> => {
  const definition = ethSetts.find((sett) => sett.settToken === token);
  if (!definition) {
    throw new UnprocessableEntity('Cannot get ZsDiggTokenBalance, requires a sett definition');
  }

  const chain = new Ethereum();
  const { sett } = await getSett(chain.graphUrl, definition.settToken);
  if (!sett) {
    // sett has not been indexed yet, or encountered a graph error
    throw new NotFound(`${definition.name} sett not found`);
  }

  // get token definitions
  const digg = getToken(TOKENS.DIGG);
  const wbtc = getToken(TOKENS.WBTC);

  // get stabilizer sett balance in digg value
  const { balance } = sett;
  const depositToken = getToken(definition.depositToken);
  const decimals = definition.balanceDecimals || depositToken.decimals;
  const diggBalance = formatBalance(balance, decimals);

  // check wbtc holding of stabilizer strategy
  const strategy = new ethers.Contract(TOKENS.WBTC, erc20Abi, chain.provider);
  const wbtcBalance = formatBalance(await strategy.balanceOf(STRATEGIES.BZS_DIGG), wbtc.decimals);

  // resolve the proper token balances
  const [diggPrice, wbtcPrice] = await Promise.all([getPrice(digg.address), getPrice(wbtc.address)]);
  const diggPerWbtc = wbtcPrice.usd / diggPrice.usd;
  const realDiggBalance = diggBalance - wbtcBalance * diggPerWbtc;
  const cachedTokens = await Promise.all([toCachedBalance(digg, realDiggBalance), toCachedBalance(wbtc, wbtcBalance)]);
  return tokenBalancesToCachedLiquidityPoolTokenBalance(depositToken.address, Protocol.Badger, cachedTokens);
};
