const { getAssetData, respond } = require("../../util/util");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const asset = event.pathParameters.settName;
  const count = event.queryStringParameters ? event.queryStringParameters.count : null;
  const data = await getAssetData(process.env.ASSET_DATA, asset, count);
  const points = data.map(item => ({x: item.timestamp, y: parseFloat(item.value)}));

  return respond(200, points);
}
