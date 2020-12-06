const { getAssetData, respond } = require("../../../util/util");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const asset = event.pathParameters.jarname;
  let data = await getAssetData(process.env.ASSET_DATA, asset);

  if (asset === "cdai") {
    const diffRatio = data[0].ratio - 1;
    data = data.map(d => {
      d.ratio -= diffRatio;
      return d;
    });
  }

  const points = data.map(item => ({x: item.timestamp, y: parseFloat(item.ratio)}));
  return respond(200, points);
}
