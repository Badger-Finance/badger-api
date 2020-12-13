const { respond, getUsdValue, getGeysers, getPrices } = require("../../util/util");
const { BADGER } = require("../../util/constants");
const { setts } = require("../../setts");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }
  return respond(200, await this.getFarmData());
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
    const apy = toDay(geyserEmissionValueRate) * 365 / geyserDepositsValue;

    farms[geyserName] = {
      tokenBalance: geyserDeposits,
      valueBalance: geyserDepositsValue,
      allocShare: allocShare,
      badgerPerHour: toHour(geyserEmissionRate),
      valuePerHour: toHour(geyserEmissionValueRate),
      badgerPerDay: toDay(geyserEmissionRate),
      valuePerDay: toDay(geyserEmissionValueRate),
      apy: apy
    };
  }));

  return farms;
};

// scaling functions
const toHour = (value) => value * 3600;
const toDay = (value) => toHour(value) * 24;
