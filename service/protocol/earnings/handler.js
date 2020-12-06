const fetch = require("node-fetch");
const { jars } = require("../../jars");
const { getContractPrice, getUniswapPrice, respond } = require("../../util/util");
const { WETH, SCRV, THREE_CRV, DAI, UNI_DAI, UNI_USDC, UNI_USDT, UNI_WBTC, RENBTC } = require("../../util/constants");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const userId = event.pathParameters.userId;
  const userData = await getUserData(userId);
  
  if (userData.data == null || userData.data.user == null) {
    return {
      statusCode: 404,
      headers: headers,
    }
  }

  const data = userData.data.user;
  const prices = await getPrices();
  const jarEarnings = data.jarBalances.map(data => {
    const asset = jars[data.jar.id].asset;
    const jarRatio = parseInt(data.jar.ratio) / Math.pow(10, 18);
    const netShareDeposit = parseInt(data.netShareDeposit);
    const grossDeposit = parseInt(data.grossDeposit);
    const grossWithdraw = parseInt(data.grossWithdraw);
    const jarTokens = jarRatio * netShareDeposit;
    const earned = (jarTokens - grossDeposit + grossWithdraw) / Math.pow(10, 18);
    const earnedUsd = getUsdValue(data.jar.token.id, earned, prices);
    return {
      id: data.jar.id,
      asset: asset,
      earned: earned,
      earnedUsd: earnedUsd,
    };
  });

  const wethRewards = data.wethRewards / Math.pow(10, 18);
  const wethEarningsUsd = wethRewards * prices.ethereum;
  const wethEarnings = {
    asset: "WETH",
    earned: wethRewards,
    earnedUsd: wethEarningsUsd,
  };
  jarEarnings.push(wethEarnings);

  let jarEarningsUsd = 0;
  if (jarEarnings && jarEarnings.length > 0) {
    jarEarningsUsd = jarEarnings.map(jar => jar.earnedUsd).reduce((total, earnedUsd) => total + earnedUsd);
  }

  const user = {
    userId: userId,
    earnings: jarEarningsUsd,
    jarEarnings: jarEarnings.filter(jar => jar.earnedUsd > 0),
  };

  return respond(200, user);
}

const getUsdValue = (asset, tokens, prices) => {
  let earnedUsd;
  switch (asset) {
    case SCRV:
      earnedUsd = tokens * prices.scrv;
      break;
    case THREE_CRV:
      earnedUsd = tokens * prices.tcrv;
      break;
    case DAI:
      earnedUsd = tokens * prices.dai;
      break;
    case UNI_DAI:
      earnedUsd = tokens * prices.unidai;
      break;
    case UNI_USDC:
      earnedUsd = tokens * prices.uniusdc;
      break;
    case UNI_USDT:
      earnedUsd = tokens * prices.uniusdt;
      break;
    case UNI_WBTC:
      earnedUsd = tokens * prices.uniwbtc;
      break;
    case RENBTC:
      earnedUsd = tokens * prices.renbtccrv;
      break;
    default:
      earnedUsd = 0;
  }
  return earnedUsd;
};

const getPrices = async () => {
  const prices = await Promise.all([
    getContractPrice(WETH),
    getContractPrice(SCRV),
    getContractPrice(THREE_CRV),
    getContractPrice(RENBTC),
    getContractPrice(DAI),
    getUniswapPrice(UNI_DAI),
    getUniswapPrice(UNI_USDC),
    getUniswapPrice(UNI_USDT),
    getUniswapPrice(UNI_WBTC),
  ]);
  return {
    ethereum: prices[0],
    scrv: prices[1],
    tcrv: prices[2],
    renbtccrv: prices[3],
    dai: prices[4],
    unidai: prices[5],
    uniusdc: prices[6],
    uniusdt: prices[7],
    uniwbtc: prices[8],
  };
};

const getUserData = async (userId) => {
  const query = `
    {
      user(id: "${userId}") {
        jarBalances(orderDirection: asc) {
          jar {
            id
            name
            ratio
            symbol
            token {
              id
            }
          }
          netDeposit
          grossDeposit
          grossWithdraw
          netShareDeposit
          grossShareDeposit
          grossShareWithdraw
        }
        staked
        sCrvRewards
        wethRewards
      }
    }
  `;
  const queryResult = await fetch(process.env.PICKLE, {
    method: "POST",
    body: JSON.stringify({query})
  });
  return queryResult.json();
};
