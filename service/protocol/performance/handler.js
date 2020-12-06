const { getAssetData, respond } = require("../../util/util");
const { getFarmData } = require("../farm/handler");
const { UNI_PICKLE } = require("../../util/constants");
const { jars } = require("../../jars");
const fetch = require("node-fetch");

// data point constants - index twice per hour, 48 per day
const CURRENT = 0;
const ONE_DAY = 24 * 60 / 10; // data points indexed at 10 minute intervals
const THREE_DAYS = ONE_DAY * 3;
const SEVEN_DAYS = ONE_DAY * 7;
const THIRTY_DAYS = ONE_DAY * 30;
const SAMPLE_DAYS = THIRTY_DAYS + 1;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  try {
    const asset = event.pathParameters.jarname;
    console.log("Request performance data for", asset);

    const isAsset = asset !== "pickle-eth";
    const performanceInfo = await Promise.all([
      getProtocolPerformance(asset),
      getFarmPerformance(asset),
      ...isAsset ? [getAssetData(process.env.ASSET_DATA, asset, SAMPLE_DAYS)] : [],
    ]);

    const protocol = performanceInfo[0];
    const farmPerformance = performanceInfo[1];
    const data = performanceInfo[2];
    const farmApy = farmPerformance ? farmPerformance : 0;
    const oneDay = isAsset ? getSamplePerformance(data, ONE_DAY) : 0 + protocol.oneDay;
    const threeDay = isAsset ? getSamplePerformance(data, THREE_DAYS) : 0 + protocol.oneDay;
    const sevenDay = isAsset ? getSamplePerformance(data, SEVEN_DAYS) : 0 + protocol.sevenDay;
    const thirtyDay = isAsset ? getSamplePerformance(data, THIRTY_DAYS) : 0 + protocol.thirtyDay;
    const jarPerformance = {
      oneDay: format(oneDay),
      threeDay: format(threeDay),
      sevenDay: format(sevenDay),
      thirtyDay: format(thirtyDay),
      oneDayFarm: format(oneDay + farmApy),
      threeDayFarm: format(threeDay + farmApy),
      sevenDayFarm: format(sevenDay + farmApy),
      thirtyDayFarm: format(thirtyDay + farmApy),
    };

    return respond(200, jarPerformance);
  } catch (err) {
    console.log(err);
    return respond(500, {
      statusCode: 500,
      message: "Unable to retreive jar performance"
    });
  }
}

// helper functions
const format = (value) => value ? parseFloat(value.toFixed(2)) : undefined;
const getRatio = (data, offset) => data.length >= offset ? data[data.length - (offset + 1)].ratio : undefined;
const getBlock = (data, offset) => data.length >= offset ? data[data.length - (offset + 1)].height : undefined;
const getTimestamp = (data, offset) => data.length >= offset ? data[data.length - (offset + 1)].timestamp : undefined;

const getPerformance = (ratioDiff, blockDiff, timeDiff) => {
  const scalar = (ONE_YEAR_MS / timeDiff) * blockDiff;
  const slope = ratioDiff / blockDiff;
  return scalar * slope * 100;
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
  return getPerformance(ratioDiff, blockDiff, timestampDiff);
};

const getFarmPerformance = async (asset) => {
  const performanceData = await getFarmData();
  const farmData = performanceData[asset];
  if (!farmData) {
    return farmData;
  }
  return farmData.apy * 100;
};

// TODO: handle 3 / 7 / 30 days, handle liqduidity edge case more gracefully
const getProtocolPerformance = async (asset) => {
  const jarKey = Object.keys(jars).find(jar => jars[jar].asset.toLowerCase() === asset);
  const switchKey = jars[jarKey] ? jars[jarKey].protocol : "uniswap"; // pickle-eth
  switch (switchKey) {
    case "curve":
      return await getCurvePerformance(asset);
    case "uniswap":
      return await getUniswapPerformance(jars[jarKey] ? jars[jarKey].token : UNI_PICKLE);
    default:
      return 0;
  }
};

const curveApi = "https://www.curve.fi/raw-stats/apys.json";
const apyMapping = {
  "3poolcrv": "3pool",
  "renbtccrv": "ren2",
  "scrv": "susd",
}
const getCurvePerformance = async (asset) => {
  const curveData = await fetch(curveApi)
    .then(response => response.json());
  return {
    oneDay: curveData.apy.day[apyMapping[asset]] * 100,
    threeDay: curveData.apy.day[apyMapping[asset]] * 100,
    sevenDay: curveData.apy.day[apyMapping[asset]] * 100,
    thirtyDay: curveData.apy.month[apyMapping[asset]] * 100,
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
  for (let i = 0; i < 30; i++) {
    let fees = pairDayResponse[i].dailyVolumeUSD * 0.003;
    totalApy += fees / pairDayResponse[i].reserveUSD * 365 * 100;
    if (apyMap[i.toString()]) {
      performance[apyMap[i.toString()]] = totalApy / (i + 1);
    }
  }
  return performance;
};
