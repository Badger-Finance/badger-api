const { getSushiswapPrice } = require("../../util/util");
const { indexAsset } = require("../indexer");

exports.handler = async (event) => {
  const getPrice = async (settData) => await getSushiswapPrice(settData.token.id);
  return await indexAsset(event, getPrice);
};
