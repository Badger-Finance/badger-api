import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ASSET_DATA, TOKENS } from '../config/constants';
import { EventInput, getBlock, getIndexedBlock, saveItem, THIRTY_MIN_BLOCKS } from '../config/util';
import { getSett } from '../setts/setts-util';

export const indexAsset = async (event: EventInput) => {
  loadChains();
  const { asset, createdBlock, contract, chain } = event;
  const targetChain = Chain.getChain(chain);
  let block = await getIndexedBlock(ASSET_DATA, asset, createdBlock);

  while (true) {
    const sett = await getSett(targetChain.graphUrl, contract, block);

    if (sett.sett == null) {
      block += THIRTY_MIN_BLOCKS;
      continue;
    }

    const { balance, totalSupply, token } = sett.sett;
    const blockData = await getBlock(block);
    const timestamp = blockData.timestamp * 1000;
    const tokenBalance = balance / Math.pow(10, token.decimals);
    const supply = totalSupply / Math.pow(10, token.decimals);
    const tokenPriceData = await targetChain.strategy.getPrice(token.id);

    let ratio = tokenBalance / supply;
    const value = tokenBalance * tokenPriceData.usd;
    if (token.id === TOKENS.DIGG) {
      ratio *= 1e9;
    }

    const snapshot = {
      asset: asset,
      height: block,
      timestamp: timestamp,
      balance: balance,
      supply: supply,
      ratio: ratio,
      value: parseFloat(value.toFixed(2)),
    };

    await saveItem(ASSET_DATA, snapshot);
    block += THIRTY_MIN_BLOCKS;
  }
};
