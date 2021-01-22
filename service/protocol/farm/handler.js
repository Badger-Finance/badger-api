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

  const badgerTotalAlloc = geysers.map((geyser) => geyser.badgerCycleRewardTokens / 1e18)
    .reduce((total, tokens) => total + tokens);
  const diggTotalAlloc = geysers.map((geyser) => geyser.diggCycleRewardTokens / 1e18)
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

    const getRate = (value, duration) => duration > 0 ? value / duration : 0;
    // calculate pool related information
    const badgerEmission = geyser.badgerCycleRewardTokens / 1e18;
    const badgerEmissionValue = badgerEmission * priceData.badger;
    const allocShareBadger = badgerEmission / badgerTotalAlloc;
    const badgerEmissionRate = getRate(badgerEmission, geyser.badgerCycleDuration);
    const badgerEmissionValueRate = getRate(badgerEmissionValue, geyser.badgerCycleDuration);
    const badgerApy = toDay(badgerEmissionValueRate) * 365 / geyserDepositsValue * 100;

    const diggEmission = geyser.diggCycleRewardTokens / 1e18;
    const diggEmissionValue = diggEmission * priceData.digg;
    const allocShareDigg = diggEmission / diggTotalAlloc;
    const diggEmissionRate = getRate(diggEmission, geyser.diggCycleDuration);
    const diggEmissionValueRate = getRate(diggEmissionValue, geyser.diggCycleDuration);
    const diggApy = toDay(diggEmissionValueRate) * 365 / geyserDepositsValue * 100;

    farms[geyserName] = {
      tokenBalance: geyserDeposits,
      valueBalance: geyserDepositsValue,
      allocShareBadger: allocShareBadger,
      allocShareDigg: allocShareDigg ? allocShareDigg : 0,
      badgerPerDay: toDay(badgerEmissionRate),
      diggPerDay: toDay(diggEmissionRate),
      badgerValuePerDay: toDay(badgerEmissionValueRate),
      diggValuePerDay: toDay(diggEmissionValueRate),
      valuePerDay: toDay(badgerEmissionValueRate + diggEmissionValueRate),
      apy: badgerApy + diggApy,
    };
  }));
  
  // Setts that do not get badger emissions - these will only measure ppfs growth
  await Promise.all(Object.entries(setts).map(async (noFarmSett, i) => {
    const sett = geyserSetts.find(s => s.id === noFarmSett[0]);
    const asset = noFarmSett[1].asset.toLowerCase();
    const farm = farms[asset];
    
    if (!farm) {
      let settDeposits = 0;
      let settDepositsValue = 0;

      if (sett) {
        const token = sett.token.id;
        settDeposits = sett.balance;
        settDepositsValue = getUsdValue(token, settDeposits, priceData);
      }

      farms[asset] = {
        tokenBalance: settDeposits,
        valueBalance: settDepositsValue,
        allocShareBadger: 0,
        allocShareDigg: 0,
        badgerPerDay: 0,
        diggPerDay: 0,
        badgerValuePerDay: 0,
        diggValuePerDay: 0,
        valuePerDay: 0,
        apy: 0,
      };
    }
  }));

  return farms;
};

// scaling functions
const toHour = (value) => value * 3600;
const toDay = (value) => toHour(value) * 24;
