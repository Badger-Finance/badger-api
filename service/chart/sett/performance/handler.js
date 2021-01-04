const { getAssetData, respond } = require("../../../util/util");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const asset = event.pathParameters.settName;
  const count = event.queryStringParameters ? event.queryStringParameters.count : null;
  let data = await getAssetData(process.env.ASSET_DATA, asset, count);
  const initialRatioDiff = data.length > 0 ? parseFloat(data[0].ratio) - 1 : 0;
  const points = data.map(item => ({x: item.timestamp, y: item.ratio - initialRatioDiff}));
  return respond(200, points);
}
