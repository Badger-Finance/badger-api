const { respond, getUsdValue, getGeysers, getPrices } = require("../../util/util");
const { getAssetPerformance } = require("../performance/handler");
const { BADGER, DIGG } = require("../../util/constants");
const { geyserAbi, diggAbi } = require('../../util/abi');
const { setts } = require("../../setts");
const { ethers } = require("ethers");
const provider = new ethers.providers.JsonRpcProvider('https://cloudflare-eth.com/');

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
    getSharesPerFragment(),
  ]);

  const priceData = prerequisites[0];
  const geyserData = prerequisites[1];
  const sharesPerFragment = prerequisites[2];
  const geysers = geyserData.data.geysers;
  const geyserSetts = geyserData.data.setts;
  const farms = {};

  const now = new Date();
  await Promise.all(geysers.map(async (geyser) => {
    // evaluate farm key & token
    const sett = geyserSetts.find(sett => sett.id === geyser.stakingToken.id);
    const geyserName = setts[sett.id].asset.toLowerCase();
    const geyserToken = sett.token.id;
    const geyserDeposits = sett.balance / 1e18;
    const geyserDepositsValue = getUsdValue(geyserToken, geyserDeposits, priceData);

    // calculate pool related information
    const getRate = (value, duration) => duration > 0 ? value / duration : 0;

    // badger emissions
    const badgerUnlockSchedules = (await getEmissions(geyser.id, BADGER)).filter(d => new Date(d.endAtSec.toNumber() * 1000) > now);
    let badgerEmission = 0;
    let badgerEmissionDuration = 0;
    badgerUnlockSchedules.forEach(s => {
      badgerEmission += s.initialLocked / 1e18;
      badgerEmissionDuration += s.durationSec;
    });
    const badgerEmissionValue = badgerEmission * priceData.badger;
    const badgerEmissionRate = getRate(badgerEmission, badgerEmissionDuration);
    const badgerEmissionValueRate = getRate(badgerEmissionValue, badgerEmissionDuration);
    const badgerApy = toDay(badgerEmissionValueRate) * 365 / geyserDepositsValue * 100;

    // digg emissions
    const diggUnlockSchedules = (await getEmissions(geyser.id, DIGG)).filter(d => new Date(d.endAtSec.toNumber() * 1000) > now);
    let diggEmission = 0;
    let diggEmissionDuration = 0;
    diggUnlockSchedules.forEach(s => {
      diggEmission += s.initialLocked / 1e9;
      diggEmissionDuration += s.durationSec;
    });
    diggEmission /= sharesPerFragment;
    const diggEmissionValue = diggEmission * priceData.digg;
    const diggEmissionRate = getRate(diggEmission, diggEmissionDuration);
    const diggEmissionValueRate = getRate(diggEmissionValue, diggEmissionDuration);
    const diggApy = toDay(diggEmissionValueRate) * 365 / geyserDepositsValue * 100;

    // avoid using infinity directly - replace with a huge value
    const combinedApy = isFinite(badgerApy) && isFinite(diggApy) ? badgerApy + diggApy : 1e99;
    farms[geyserName] = {
      tokenBalance: geyserDeposits,
      valueBalance: geyserDepositsValue,
      badgerPerDay: toDay(badgerEmissionRate),
      diggPerDay: toDay(diggEmissionRate),
      badgerValuePerDay: toDay(badgerEmissionValueRate),
      diggValuePerDay: toDay(diggEmissionValueRate),
      valuePerDay: toDay(badgerEmissionValueRate + diggEmissionValueRate),
      apy: combinedApy,
      badgerApy: badgerApy,
      diggApy: diggApy,
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
        settDeposits = parseInt(sett.balance);
        settDepositsValue = getUsdValue(token, settDeposits, priceData);
      }

      farms[asset] = {
        tokenBalance: settDeposits,
        valueBalance: settDepositsValue,
        badgerPerDay: 0,
        diggPerDay: 0,
        badgerValuePerDay: 0,
        diggValuePerDay: 0,
        valuePerDay: 0,
        apy: 0,
        badgerApy: 0,
        diggApy: 0,
      };
    }
  }));

  return farms;
};

const getEmissions = async (geyser, token) => {
  const geyserContract = new ethers.Contract(geyser, geyserAbi, provider);
  return await geyserContract.getUnlockSchedulesFor(token);
};

const getSharesPerFragment = async () => {
  const diggContract = new ethers.Contract(DIGG, diggAbi, provider);
  return await diggContract._sharesPerFragment();
}

// scaling functions
const toHour = (value) => value * 3600;
const toDay = (value) => toHour(value) * 24;
