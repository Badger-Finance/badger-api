const fetch = require("node-fetch");

module.exports.getMasterChef = async () => {
  let query = `
    {
      masterChef(id: "0xbd17b1ce622d73bd438b9e658aca5996dc394b0d") {
        id
        totalAllocPoint
        rewardsPerBlock
      },
      masterChefPools(where: {allocPoint_gt: 0}, orderBy: allocPoint, orderDirection: desc) {
        id
        token {
          id
        }
        balance
        allocPoint
        lastRewardBlock
        accPicklePerShare
      }
    }
  `;
  return await fetch(process.env.PICKLE, {
    method: "POST",
    body: JSON.stringify({query})
  }).then(response => response.json());
};
