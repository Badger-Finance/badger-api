const { getMasterChef } = require("../../util/masterChef");
const { respond, getContractPrice, getUsdValue, getJar } = require("../../util/util");
const { jars } = require("../../jars");
const { PICKLE } = require("../../util/constants");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }
  return respond(200, await this.getFarmData());
};

module.exports.getFarmData = async () => {
  // parallelize calls
  const prerequisites = await Promise.all([
    getContractPrice(PICKLE),
    getMasterChef()
  ]);

  const picklePrice = prerequisites[0];
  const masterChefData = prerequisites[1];
  const masterChef = masterChefData.data.masterChef;
  const masterChefPools = masterChefData.data.masterChefPools;
  const farms = {
    picklePerBlock: masterChef.rewardsPerBlock / 1e18,
  };

  await Promise.all(masterChefPools.map(async (pool) => {
    // evaluate farm key & token
    const jarKey = Object.keys(jars).find(key => key === pool.token.id);
    const farmName = jarKey ? jars[jarKey].asset.toLowerCase() : "pickle-eth"; // only non-jar farm
    const poolToken = jarKey ? jars[jarKey].token : pool.token.id;

    // calculate pool related information
    const allocShare = pool.allocPoint / masterChef.totalAllocPoint;
    const picklePerBlock = allocShare * farms.picklePerBlock;
    const valuePerBlock = picklePerBlock * picklePrice;
    const tokenBalance = pool.balance / 1e18;

    const valueInfo = await Promise.all([
      getUsdValue(poolToken, tokenBalance),
      ...jarKey ? [getJar(jarKey)] : [],
    ]);

    const ratio = jarKey ? valueInfo[1].data.jar.ratio / 1e18 : 1;
    const valueBalance = valueInfo[0] * ratio;
    const apy = toDay(valuePerBlock) / valueBalance * 365;
    farms[farmName] = {
      tokenBalance: tokenBalance,
      valueBalance: format(valueBalance),
      allocShare: allocShare,
      picklePerBlock: format(picklePerBlock),
      valuePerBlock: format(valuePerBlock),
      picklePerHour: format(toHour(picklePerBlock)),
      valuePerHour: format(toHour(valuePerBlock)),
      picklePerDay: format(toDay(picklePerBlock)),
      valuePerDay: format(toDay(valuePerBlock)),
      apy: format(apy)
    };
  }));

  return farms;
};

// scaling functions
const toHour = (value) => value * 276;
const toDay = (value) => toHour(value) * 24;
const format = (value) => parseFloat(value.toFixed(4));
