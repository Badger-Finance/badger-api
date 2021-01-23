const { respond, getGeysers } = require("../../util/util");

const formatFloat = (value) => parseFloat(parseFloat(value).toFixed(2));
exports.handler = async (event) => {
  const ppfsData = {};
  try {
    const settData = (await getGeysers()).data.setts;  
    settData.forEach(s => ppfsData[s.id] = s.pricePerFullShare / 1e18);
    return respond(200, ppfsData);
  } catch (err) {
    respond(500, {
      statusCode: 500,
      message: 'Unable to fetch PPFS ' + err,
    });
  }
};
