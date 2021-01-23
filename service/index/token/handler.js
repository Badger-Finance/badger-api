const { getTokenPrice } = require("../../util/util");
const { indexAsset } = require("../indexer");

exports.handler = async (event) => {
  const getPrice = async () => await getTokenPrice(event.token);
  return await indexAsset(event, getPrice);
};
