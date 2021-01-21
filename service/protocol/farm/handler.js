const { respond, getUsdValue, getGeysers, getPrices } = require("../../util/util");
const { getAssetPerformance } = require("../performance/handler");
const { setts, diggSetts } = require("../../setts");
const { DIGG, BADGER } = require("../../util/constants");

exports.handler = async (event) => {
  try {
    const farmData = await this.getFarmData();
    const settData = await Promise.all(Object.entries(setts).map(sett => getAssetPerformance(sett[1].asset.toLowerCase(), farmData)));
    Object.entries(setts).forEach((sett, i) => {
      const farm = farmData[sett[1].asset.toLowerCase()];
      if (farm) {
        const combinedApy = settData[i].threeDayFarm;
        farm.apy = combinedApy ? combinedApy : farm.apy;
      }
    });
    return respond(200, farmData);
  } catch (err) {
    console.log(err);
    return respond(500, {
      statusCode: 500,
      message: "Unable to retreive sett performance"
    });
  }
};

module.exports.getFarmData = async () => {
  // parallelize calls
  const prerequisites = await Promise.all([
    getPrices(),
    getGeysers(),
  ]);

  const priceData = prerequisites[0];
  const geyserData = prerequisites[1];
  const geysers = geyserData.data.geysers;
  const geyserSetts = geyserData.data.setts;
  const farms = {};

  const totalAlloc = geysers.map((geyser) => geyser.cycleRewardTokens / 1e18)
    .reduce((total, tokens) => total + tokens);
  await Promise.all(geysers.map(async (geyser) => {
    // evaluate farm key & token
    const sett = geyserSetts.find(sett => sett.id === geyser.stakingToken.id);
    const geyserName = setts[sett.id].asset.toLowerCase();
    const geyserToken = sett.token.id;
    const geyserShares = geyser.netShareDeposit;
    const pricePerFullShare = sett.pricePerFullShare / 1e18;
    const geyserDeposits = geyserShares * pricePerFullShare / 1e18;
    const geyserDepositsValue = getUsdValue(geyserToken, geyserDeposits, priceData);

    // calculate pool related information
    const geyserEmission = geyser.cycleRewardTokens / 1e18;
    const geyserEmissionValue = geyserEmission * priceData.badger;
    const allocShare = geyserEmission / totalAlloc;
    const geyserEmissionRate = geyserEmission / geyser.cycleDuration;
    const geyserEmissionValueRate = geyserEmissionValue / geyser.cycleDuration;
    const apy = toDay(geyserEmissionValueRate) * 365 / geyserDepositsValue * 100;
    const tokenName = diggSetts.includes(sett.id) ? 'DIGG' : 'BADGER';

    farms[geyserName] = {
      tokenBalance: geyserDeposits,
      valueBalance: geyserDepositsValue,
      allocShare: allocShare,
      tokensPerHour: toHour(geyserEmissionRate),
      valuePerHour: toHour(geyserEmissionValueRate),
      tokensPerDay: toDay(geyserEmissionRate),
      valuePerDay: toDay(geyserEmissionValueRate),
      apy: apy,
      token: tokenName,
    };
  }));
  
  // Setts that do not get badger emissions - these will only measure ppfs growth
  await Promise.all(Object.entries(setts).map(async (noFarmSett, i) => {
    const sett = geyserSetts.find(s => s.id === noFarmSett[0]);
    const asset = noFarmSett[1].asset.toLowerCase();
    const farm = farms[asset];
    const tokenName = diggSetts.includes(noFarmSett[0]) ? 'DIGG' : 'BADGER';
    
    if (!farm) {
      let settDeposits = 0;
      let settDepositsValue = 0;

      if (sett) {
        const token = sett.token.id;
        const settShares = sett.netShareDeposit;
        const pricePerFullShare = sett. pricePerFullShare / 1e18;
        settDeposits = settShares * pricePerFullShare;
        settDepositsValue = getUsdValue(token, settDeposits, priceData);
      }

      farms[asset] = {
        tokenBalance: settDeposits,
        valueBalance: settDepositsValue,
        allocShare: 0,
        tokensPerHour: 0,
        valuePerHour: 0,
        tokensPerDay: 0,
        valuePerDay: 0,
        apy: 0,
        token: tokenName,
      };
    }
  }));

  return farms;
};

// scaling functions
const toHour = (value) => value * 3600;
const toDay = (value) => toHour(value) * 24;
