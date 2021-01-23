const fetch = require("node-fetch");
const { setts } = require("../../setts");
const { getPrices, respond } = require("../../util/util");
const { UNI_BADGER, SBTC, BADGER, RENBTC, TBTC, SUSHI_BADGER, SUSHI_WBTC, SUSHI_DIGG, UNI_DIGG, DIGG } = require("../../util/constants");
const Web3 = require("web3");
const web3 = new Web3(new Web3.providers.HttpProvider('https://web3.1inch.exchange/'));
const { diggContract, diggAbi } = require("../../util/abi");

exports.handler = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    return 200;
  }

  const userId = event.pathParameters.userId.toLowerCase();
  console.log(userId);
  const userData = await getUserData(userId);
  
  if (userData.data == null || userData.data.user == null) {
    return respond(404);
  }

  const data = userData.data.user;
  const prices = await getPrices();
  const contract = new web3.eth.Contract(diggAbi, diggContract);
  const sharesPerFragment = await contract.methods._sharesPerFragment().call();
  const settEarnings = data.settBalances.map(data => {
    const asset = setts[data.sett.id].asset;
    const settPricePerFullShare = parseInt(data.sett.pricePerFullShare) / 1e18;
    const netShareDeposit = parseInt(data.netShareDeposit);
    const grossDeposit = parseInt(data.grossDeposit);
    const grossWithdraw = parseInt(data.grossWithdraw);
    const settTokens = parseFloat(settPricePerFullShare * netShareDeposit);
    const earned = (settTokens - grossDeposit + grossWithdraw) / 1e18;
    const balance = settTokens / 1e18;
    if (asset === 'digg') {
      earned /= sharesPerFragment;
      balance /= sharesPerFragment;
    }
    const earnedUsd = getUsdValue(data.sett.token.id, earned, prices);
    const balanceUsd = getUsdValue(data.sett.token.id, balance, prices);
    return {
      id: data.sett.id,
      asset: asset,
      balance: balance,
      balanceUsd: balanceUsd,
      earned: earned,
      earnedUsd: earnedUsd,
    };
  });

  let settEarningsUsd = 0;
  if (settEarnings && settEarnings.length > 0) {
    settEarningsUsd = settEarnings.map(jar => jar.earnedUsd).reduce((total, earnedUsd) => total + earnedUsd);
  }

  const user = {
    userId: userId,
    earnings: settEarningsUsd,
    settEarnings: settEarnings,
  };

  return respond(200, user);
}

const getUsdValue = (asset, tokens, prices) => {
  let earnedUsd;
  switch (asset) {
    case UNI_BADGER:
      earnedUsd = tokens * prices.unibadger;
      break;
    case BADGER:
      earnedUsd = tokens * prices.badger;
      break;
    case SBTC:
      earnedUsd = tokens * prices.sbtc;
      break;
    case TBTC:
      earnedUsd = tokens * prices.tbtc;
      break;
    case RENBTC:
      earnedUsd = tokens * prices.renbtc;
      break;
    case SUSHI_BADGER:
      earnedUsd = tokens * prices.sushibadger;
      break;
    case SUSHI_WBTC:
      earnedUsd = tokens * prices.sushiwbtc;
      break;
    case SUSHI_DIGG:
      earnedUsd = tokens * prices.sushidigg;
      break;
    case UNI_DIGG:
      earnedUsd = tokens * prices.unidigg;
      break;
    case DIGG:
      earnedUsd = tokens * prices.digg;
      break;
    default:
      earnedUsd = 0;
  }
  return earnedUsd;
};

const getUserData = async (userId) => {
  const query = `
    {
      user(id: "${userId}") {
        settBalances(orderDirection: asc) {
          sett {
            id
            name
            pricePerFullShare
            symbol
            token {
              id
              decimals
            }
          }
          netDeposit
          grossDeposit
          grossWithdraw
          netShareDeposit
          grossShareDeposit
          grossShareWithdraw
        }
      }
    }
  `;
  const queryResult = await fetch(process.env.BADGER, {
    method: "POST",
    body: JSON.stringify({query})
  });
  return queryResult.json();
};
