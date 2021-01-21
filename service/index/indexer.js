const { getSett, getBlock, getIndexedBlock, saveItem } = require("../util/util");

const THIRTY_MIN_BLOCKS = parseInt(30 * 60 / 13);
module.exports.indexAsset =  async (event, getPrice) => {
  const { asset, createdBlock, contract } = event;
  let block = await getIndexedBlock(process.env.ASSET_DATA, asset, createdBlock);
  console.log(`Index ${asset} at height: ${block}`);

  while (true) {
    const sett = await getSett(contract, block);

    if (sett.errors != undefined && sett.errors != null) {
      break;
    }

    if (sett.data == null || sett.data.sett == null) {
      block += THIRTY_MIN_BLOCKS;
      continue;
    }

    const settData = sett.data.sett;
    const blockData = await getBlock(block);
    const timestamp = blockData.timestamp * 1000;
    const balance = settData.balance / Math.pow(10, 18);
    const supply = settData.totalSupply / Math.pow(10, 18);
    const ratio = settData.pricePerFullShare / Math.pow(10, 18);
    const value = balance * await getPrice(settData);
    
    const snapshot = {
      asset: asset,
      height: block,
      timestamp: timestamp,
      balance: balance,
      supply: supply,
      ratio: ratio,
      value: parseFloat(value.toFixed(2)),
    };

    saveItem(process.env.ASSET_DATA, snapshot);
    block += THIRTY_MIN_BLOCKS;
  }

  return 200;
};
