const { setts } = require("../setts");
const { UNI_BADGER } = require("../util/constants");
const { getAssetData, getUniswapPair, respond } = require("../util/util");

const formatFloat = (value) => parseFloat(parseFloat(value).toFixed(2));
exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const includeToken = event.queryStringParameters ? event.queryStringParameters.tokens : false;
  const liquidity = await getUniswapPair(UNI_BADGER);
  const assetValues = {
    "liquidity": formatFloat(liquidity.data.pair.reserveUSD),
    ...includeToken && {"liquidityTokens": parseFloat(liquidity.data.pair.totalSupply)},
  };

  let updatedAt = 0;
  let settValue = 0;
  for (const key of Object.keys(setts)) {
    const asset = setts[key].asset.toLowerCase();
    const assetData = await getAssetData(process.env.ASSET_DATA, asset, 1);
    console.log("Getting values for ", asset);
    console.log(assetData);
    if (assetData == null || assetData == undefined) {
      continue;
    }
    const value = formatFloat(assetData[0].value);
    updatedAt = Math.max(updatedAt, assetData[0].timestamp);
    assetValues[asset] = value;
    if (includeToken) {
      const tokenValueKey = asset + "Tokens";
      assetValues[tokenValueKey] = parseFloat(assetData[0].balance);
    }
    settValue += value;
  }
  assetValues.totalValue = settValue;
  assetValues.updatedAt = updatedAt;

  return respond(200, assetValues);
};
