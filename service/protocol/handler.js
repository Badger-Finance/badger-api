const { setts } = require("../setts");
const { respond, getGeysers, getPrices, getUsdValue } = require("../util/util");

const formatFloat = (value) => parseFloat(parseFloat(value).toFixed(2));
exports.handler = async (event) => {
  const includeToken = event.queryStringParameters ? event.queryStringParameters.tokens : false;
  const assetValues = {};
  const data = await Promise.all([
    getPrices(),
    getGeysers(),
  ]);
  const prices = data[0];
  const geyserData = data[1];
  const settData = geyserData.data.setts;

  let totalValue = 0;
  for (const key of Object.keys(setts)) {
    const asset = setts[key].asset.toLowerCase();
    const tokenValueKey = asset + "Tokens";
    const settInfo = settData.find(s => s.id === key);
    if (settInfo == null || settInfo == undefined) {
      assetValues[asset] = 0;
      if (includeToken) {
        assetValues[tokenValueKey] = 0;
      }
      continue;
    }
    let tokens;
    if (asset === 'digg') {
      tokens = settInfo.balance / 1e9;
    } else {
      tokens = settInfo.balance / 1e18;
    }
    const value = formatFloat(getUsdValue(settInfo.token.id, tokens, prices));
    assetValues[asset] = value;
    if (includeToken) {
      assetValues[tokenValueKey] = parseFloat(tokens);
    }
    totalValue += value;
  }
  assetValues.totalValue = totalValue;

  return respond(200, assetValues);
};
