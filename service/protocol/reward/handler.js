const { respond, getContractPrice } = require("../../util/util");
const { PICKLE, WETH } = require("../../util/constants");
const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const stakingInfo = await Promise.all([
    getStakingData(),
    getContractPrice(PICKLE),
    getContractPrice(WETH),
  ]);

  const stakingData = stakingInfo[0].data.rewardContract;
  const picklePrice = stakingInfo[1];
  const wethPrice = stakingInfo[2];
  const stakedTokens = stakingData.stakedTokens / 1e18;
  const stakedValue = stakingData.stakedTokens / 1e18 * picklePrice;
  const stakedPercent = stakingData.stakedTokens / stakingData.stakingTokenTotalSupply;
  const currentRewards = stakingData.periodRewards / 1e18;
  const currentRewardsValue = currentRewards * wethPrice;
  const pendingRewards = stakingData.currentRewards / 1e18;
  const pendingRewardsValue = pendingRewards * wethPrice;
  const totalRewards = stakingData.totalRewards / 1e18;
  const totalRewardsValue = totalRewards * wethPrice;
  const apy = currentRewardsValue / stakedValue * 52;
  const rewardData = {
    rewardToken: WETH,
    stakedTokens: stakedTokens,
    stakedValue: stakedValue,
    stakedPercent: stakedPercent,
    currentRewards: currentRewards,
    currentRewardsValue: currentRewardsValue,
    pendingRewards: pendingRewards,
    pendingRewardsValue: pendingRewardsValue,
    totalRewards: totalRewards,
    totalRewardsValue: totalRewardsValue,
    apy: apy,
  };

  return respond(200, rewardData);
};

const getStakingData = async () => {
  let query = `
    {
      rewardContract(id: "0xa17a8883da1abd57c690df9ebf58fc194edab66f") {
        periodRewards
        totalRewards
        currentRewards
        stakedTokens
        stakingTokenTotalSupply
      }
    }
  `;
  return await fetch(process.env.PICKLE, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};
