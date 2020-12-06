const { jars } = require("../jars");
const { UNI_PICKLE } = require("../util/constants");
const { getAssetData, getUniswapPair, respond } = require("../util/util");

const formatFloat = (value) => parseFloat(parseFloat(value).toFixed(2));
exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const includeToken = event.queryStringParameters ? event.queryStringParameters.tokens : false;
  const liquidity = await getUniswapPair(UNI_PICKLE);
  const assetValues = {
    "pickle-eth": formatFloat(liquidity.data.pair.reserveUSD),
    ...includeToken && {"pickle-ethTokens": parseFloat(liquidity.data.pair.totalSupply)},
  };

  let updatedAt = 0;
  let jarValue = 0;
  for (const key of Object.keys(jars)) {
    const asset = jars[key].asset.toLowerCase();
    const assetData = await getAssetData(process.env.ASSET_DATA, asset, 1);
    const value = formatFloat(assetData[0].value);
    updatedAt = Math.max(updatedAt, assetData[0].timestamp);
    assetValues[asset] = value;
    if (includeToken) {
      const tokenValueKey = asset + "Tokens";
      assetValues[tokenValueKey] = parseFloat(assetData[0].balance);
    }
    jarValue += value;
  }
  assetValues.jarValue = jarValue;
  assetValues.totalValue = jarValue + assetValues["pickle-eth"];
  assetValues.updatedAt = updatedAt;

  return respond(200, assetValues);
};
