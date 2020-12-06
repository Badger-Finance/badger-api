const { getUniswapPrice } = require("../../util/util");
const { indexAsset } = require("../indexer");

exports.handler = async (event) => {
  const getPrice = async (jarData) => await getUniswapPrice(jarData.token.id);
  return await indexAsset(event, getPrice);
};
