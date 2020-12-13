const { getAssetData, respond } = require("../../../util/util");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const asset = event.pathParameters.settName;
  let data = await getAssetData(process.env.ASSET_DATA, asset);
  const points = data.map(item => ({x: item.timestamp, y: parseFloat(item.ratio)}));
  return respond(200, points);
}
