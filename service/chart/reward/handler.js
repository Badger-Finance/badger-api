const { getAssetData, respond } = require("../../util/util");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }
  
  const asset = event.pathParameters.token;
  const count = event.queryStringParameters ? event.queryStringParameters.count : null;
  const data = await getAssetData(process.env.REWARD_DATA, asset, count);
  const points = data.map(item => ({x: item.timestamp, y: parseFloat(item.staked)}));

  return respond(200, points);
}
