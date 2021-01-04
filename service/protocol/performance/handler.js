const { getAssetData, respond } = require("../../util/util");
const { setts } = require("../../setts");
const { getFarmData } = require("../farm/handler");
const fetch = require("node-fetch");

// data point constants - index twice per hour, 48 per day
const CURRENT = 0;
const ONE_DAY = 24; // data points indexed at 10 minute intervals
const THREE_DAYS = ONE_DAY * 3;
const SEVEN_DAYS = ONE_DAY * 7;
const THIRTY_DAYS = ONE_DAY * 30;
const SAMPLE_DAYS = THIRTY_DAYS + 1;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

exports.handler = async (event) => {
  try {
    const asset = event.pathParameters.settName;
    const farmData = await getFarmData();
    return respond(200, await getAssetPerformance(asset, farmData));
  } catch (err) {
    console.log(err);
    return respond(500, {
      statusCode: 500,
      message: "Unable to retreive sett performance"
    });
  }
};

exports.summaryHandler = async (event) => {
  try {
    const settPerformance = {};
    const farmData = await getFarmData();
    const settData = await Promise.all(Object.entries(setts).map(sett => getAssetPerformance(sett[1].asset.toLowerCase(), farmData)));
    Object.entries(setts).forEach((sett, i) => settPerformance[sett[1].asset.toLowerCase()] = settData[i]);
    return respond(200, settPerformance);
  } catch (err) {
    console.log(err);
    return respond(500, {
      statusCode: 500,
      message: "Unable to retreive sett performance"
    });
  }
};

const getAssetPerformance = async (asset, farmPerformance) => {
  console.log("Request performance data for", asset);

  const performanceInfo = await Promise.all([
    getProtocolPerformance(asset),
    getAssetData(process.env.ASSET_DATA, asset, SAMPLE_DAYS),
  ]);

  const protocol = performanceInfo[0];
  const data = performanceInfo[1];
  const farmApy = farmPerformance[asset] ? farmPerformance[asset].apy : 0;
  const oneDay = getSamplePerformance(data, ONE_DAY) + protocol.oneDay;
  const threeDay = getSamplePerformance(data, THREE_DAYS) + protocol.oneDay;
  const sevenDay = getSamplePerformance(data, SEVEN_DAYS) + protocol.sevenDay;
  const thirtyDay = getSamplePerformance(data, THIRTY_DAYS) + protocol.thirtyDay;
  const settPerformance = {
    oneDay: format(oneDay),
    threeDay: format(threeDay),
    sevenDay: format(sevenDay),
    thirtyDay: format(thirtyDay),
    oneDayFarm: format(oneDay + farmApy),
    threeDayFarm: format(threeDay + farmApy),
    sevenDayFarm: format(sevenDay + farmApy),
    thirtyDayFarm: format(thirtyDay + farmApy),
  };

  return settPerformance;
};

// helper functions
const format = (value) => value !== undefined ? parseFloat(value) : undefined;
const getRatio = (data, offset) => data.length > offset ? data[data.length - (offset + 1)].ratio : undefined;
const getBlock = (data, offset) => data.length > offset ? data[data.length - (offset + 1)].height : undefined;
const getTimestamp = (data, offset) => data.length > offset ? data[data.length - (offset + 1)].timestamp : undefined;

const getPerformance = (ratioDiff, blockDiff, timeDiff) => {
  const scalar = (ONE_YEAR_MS / timeDiff) * blockDiff;
  const slope = ratioDiff / blockDiff;
  return scalar * slope;
};

const getSamplePerformance = (data, offset) => {
  // get current values
  const currentRatio = getRatio(data, CURRENT);
  const currentBlock = getBlock(data, CURRENT);
  const currentTimestamp = getTimestamp(data, CURRENT);

  // get sampled ratios
  const sampledRatio = getRatio(data, offset);
  const sampledBlock = getBlock(data, offset);
  const sampledTimestamp = getTimestamp(data, offset);

  if (!sampledRatio || !sampledBlock || !sampledTimestamp) {
    return undefined;
  }

  const ratioDiff = currentRatio - sampledRatio;
  const blockDiff = currentBlock - sampledBlock;
  const timestampDiff = currentTimestamp - sampledTimestamp;
  return getPerformance(ratioDiff, blockDiff, timestampDiff) * 100;
};

// TODO: handle 3 / 7 / 30 days, handle liqduidity edge case more gracefully
const getProtocolPerformance = async (asset) => {
  const settKey = Object.keys(setts).find(sett => setts[sett].asset.toLowerCase() === asset);
  const switchKey = setts[settKey].protocol;
  switch (switchKey) {
    case "curve":
      return await getCurvePerformance(asset);
    case "uniswap":
      return await getUniswapPerformance(setts[settKey].token);
    default:
      return {
        oneDay: 0,
        threeDay: 0,
        sevenDay: 0,
        thirtyDay: 0,
      };;
  }
};

const curveApi = "https://www.curve.fi/raw-stats/apys.json";
const apyMapping = {
  "hrenbtccrv": "ren2",
  "renbtccrv": "ren2",
  "sbtccrv": "rens",
  "tbtccrv": "tbtc",
}
const getCurvePerformance = async (asset) => {
  const curveData = await fetch(curveApi)
    .then(response => response.json());
  return {
    oneDay: curveData.apy.day[apyMapping[asset]],
    threeDay: curveData.apy.day[apyMapping[asset]],
    sevenDay: curveData.apy.day[apyMapping[asset]],
    thirtyDay: curveData.apy.month[apyMapping[asset]],
  };
};

const getUniswapPerformance = async (asset) => {
  const query = `
    {
      pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${asset}"}) {
        reserveUSD
        dailyVolumeUSD
      }
    }
  `;
  const pairDayResponse = await fetch(process.env.UNISWAP, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json())
  .then(pairInfo => pairInfo.data.pairDayDatas);

  const apyMap = {
    "0": "oneDay",
    "2": "threeDay",
    "6": "sevenDay",
    "29": "thirtyDay",
  };
  const performance = {}
  let totalApy = 0;
  for (let i = 0; i < Math.min(30, pairDayResponse.length); i++) {
    let fees = pairDayResponse[i].dailyVolumeUSD * 0.003;
    totalApy += fees / pairDayResponse[i].reserveUSD * 365;
    if (apyMap[i.toString()]) {
      performance[apyMap[i.toString()]] = totalApy / (i + 1);
    }
  }
  return performance;
};
