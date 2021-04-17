import { NotFound } from '@tsed/exceptions';
import { saveItem } from '../aws/dynamodb-utils';
import { loadChains } from '../chains/chain';
import { Chain } from '../chains/config/chain.config';
import { ASSET_DATA, Protocol } from '../config/constants';
import { EventInput, getBlock, getIndexedBlock } from '../config/util';
import { getSett } from '../setts/setts-util';

export const indexAsset = async (event: EventInput) => {
  loadChains();
  const { asset, createdBlock, contract, chain } = event;
  const targetChain = Chain.getChain(chain);
  const thirtyMinutesBlocks = parseInt((targetChain.blocksPerYear / 365 / 24 / 2).toString());

  let block = await getIndexedBlock(ASSET_DATA, asset, createdBlock);

  while (true) {
    const sett = await getSett(targetChain.graphUrl, contract, block);

    if (sett.sett == null) {
      block += thirtyMinutesBlocks;
      continue;
    }

    const { balance, totalSupply, pricePerFullShare, token, id } = sett.sett;
    const settDefintion = targetChain.setts.find((sett) => sett.settToken.toLowerCase() === id);
    if (!settDefintion) {
      throw new NotFound(`${id} is not a valid sett token`);
    }
    const blockData = await getBlock(block, chain);
    const timestamp = blockData.timestamp * 1000;
    const tokenBalance = balance / Math.pow(10, token.decimals);
    const divDecimals =
      settDefintion.affiliate && settDefintion.affiliate.protocol === Protocol.Yearn ? token.decimals : 18;
    const supply = totalSupply / Math.pow(10, divDecimals);
    const ratio = pricePerFullShare / Math.pow(10, divDecimals);
    const tokenPriceData = await targetChain.strategy.getPrice(token.id);
    const value = tokenBalance * tokenPriceData.usd;

    const snapshot = {
      asset: asset,
      height: block,
      timestamp: timestamp,
      balance: tokenBalance,
      supply: supply,
      ratio: ratio,
      value: parseFloat(value.toFixed(2)),
    };

    await saveItem(ASSET_DATA, snapshot);
    block += thirtyMinutesBlocks;
  }
};
