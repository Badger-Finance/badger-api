const { getContractPrice, getTokenPrice } = require("../../util/util");
const { indexAsset } = require("../indexer");

exports.handler = async (event) => {
  const getPrice = async (settData) => {
    const price = await getContractPrice(settData.token.id);
    if (price) {
      return price;
    }
    return await getTokenPrice("bitcoin");
  }
  return await indexAsset(event, getPrice);
};
