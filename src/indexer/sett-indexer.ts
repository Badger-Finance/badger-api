import { ChainStrategy } from '../chains/strategies/chain.strategy';
import { initStrategies } from '../config/chain/chain';
import { ASSET_DATA } from '../config/constants';
import { EventInput, getBlock, getIndexedBlock, saveItem, THIRTY_MIN_BLOCKS } from '../config/util';
import { getSett } from '../setts/setts-util';

export const indexAsset = async (event: EventInput) => {
  initStrategies();
  const { asset, createdBlock, contract } = event;
  let block = await getIndexedBlock(ASSET_DATA, asset, createdBlock);

  while (true) {
    const sett = await getSett(contract, block);

    if (sett.sett == null) {
      block += THIRTY_MIN_BLOCKS;
      continue;
    }

    const { balance, totalSupply, pricePerFullShare, token } = sett.sett;

    const blockData = await getBlock(block);
    const timestamp = blockData.timestamp * 1000;
    const tokenBalance = balance / Math.pow(10, token.decimals);
    const supply = totalSupply / Math.pow(10, token.decimals);
    const ratio = pricePerFullShare / Math.pow(10, 18);
    const strategy = ChainStrategy.getStrategy(token.id);
    const tokenPriceData = await strategy.getPrice(token.id);
    const value = tokenBalance * tokenPriceData.usd;

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
