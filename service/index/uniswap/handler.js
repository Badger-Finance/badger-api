const { getUniswapPrice } = require("../../util/util");
const { indexAsset } = require("../indexer");

exports.handler = async (event) => {
  const getPrice = async (settData) => await getUniswapPrice(settData.token.id);
  return await indexAsset(event, getPrice);
};
