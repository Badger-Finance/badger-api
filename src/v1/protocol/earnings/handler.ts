import fetch from 'node-fetch';
import { setts } from '../../setts';
import { BADGER_URL, TOKENS } from '../../util/constants';
import { EventInput, getPrices, respond } from '../../util/util';

export const handler = async (event: EventInput) => {
  if (event.source === 'serverless-plugin-warmup') {
    return respond(200);
  }

  const userId = event.pathParameters!.userId.toLowerCase();
  console.log(userId);
  const userData = await getUserData(userId);

  if (!userData.data || !userData.data.user) {
    return respond(500);
  }

  const data = userData.data.user;
  const prices = await getPrices();
  const settEarnings = data.settBalances.map((settBalance) => {
    const sett = settBalance.sett;
    const asset = setts[sett.id].asset;
    let settPricePerFullShare = parseInt(sett.pricePerFullShare) / 1e18;
    let ratio = 1;
    if (asset.toLowerCase() === 'digg') {
      ratio = sett.balance / sett.totalSupply / settPricePerFullShare;
      settPricePerFullShare = sett.balance / sett.totalSupply;
    }
    const netShareDeposit = parseInt(settBalance.netShareDeposit);
    const grossDeposit = parseInt(settBalance.grossDeposit) * ratio; // FIXME: check to make sure this change is right
    const grossWithdraw = parseInt(settBalance.grossWithdraw) * ratio; // FIXME: check to make sure this change is right
    const settTokens = settPricePerFullShare * netShareDeposit; // FIXME: check to make sure this change is right
    const earned = (settTokens - grossDeposit + grossWithdraw) / Math.pow(10, sett.token.decimals);
    const balance = settTokens / Math.pow(10, sett.token.decimals);
    const earnedUsd = getUsdValue(sett.token.id, earned, prices);
    const balanceUsd = getUsdValue(sett.token.id, balance, prices);
    return {
      id: sett.id,
      asset: asset,
      balance: balance,
      balanceUsd: balanceUsd,
      earned: earned,
      earnedUsd: earnedUsd,
    };
  });

  let settEarningsUsd = 0;
  if (settEarnings && settEarnings.length > 0) {
    settEarningsUsd = settEarnings.map((jar) => jar.earnedUsd).reduce((total, earnedUsd) => total + earnedUsd);
  }

  const user = {
    userId: userId,
    earnings: settEarningsUsd,
    settEarnings: settEarnings,
  };

  return respond(200, user);
};

const getUsdValue = (asset: string, tokens: number, prices: { [index: string]: number }) => {
  let earnedUsd;
  switch (asset) {
    case TOKENS.UNI_BADGER:
      earnedUsd = tokens * prices.unibadger;
      break;
    case TOKENS.BADGER:
      earnedUsd = tokens * prices.badger;
      break;
    case TOKENS.SBTC:
      earnedUsd = tokens * prices.sbtc;
      break;
    case TOKENS.TBTC:
      earnedUsd = tokens * prices.tbtc;
      break;
    case TOKENS.RENBTC:
      earnedUsd = tokens * prices.renbtc;
      break;
    case TOKENS.SUSHI_BADGER:
      earnedUsd = tokens * prices.sushibadger;
      break;
    case TOKENS.SUSHI_WBTC:
      earnedUsd = tokens * prices.sushiwbtc;
      break;
    case TOKENS.SUSHI_DIGG:
      earnedUsd = tokens * prices.sushidigg;
      break;
    case TOKENS.UNI_DIGG:
      earnedUsd = tokens * prices.unidigg;
      break;
    case TOKENS.DIGG:
      earnedUsd = tokens * prices.digg;
      break;
    default:
      earnedUsd = 0;
  }
  return earnedUsd;
};

export type SettBalanceData = {
  sett: {
    id: string;
    name: string;
    balance: number;
    totalSupply: number;
    pricePerFullShare: string;
    symbol: string;
    token: {
      id: string;
      decimals: number;
    };
  };
  netDeposit: number;
  grossDeposit: string;
  grossWithdraw: string;
  netShareDeposit: string;
  grossShareDeposit: string;
  grossShareWithdraw: string;
};

export type UserData = {
  data: {
    user: {
      settBalances: SettBalanceData[];
    };
  };
  errors: any;
};

const getUserData = async (userId: string): Promise<UserData> => {
  const query = `
    {
      user(id: "${userId}") {
        settBalances(orderDirection: asc) {
          sett {
            id
            name
            balance
            totalSupply
            netShareDeposit
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
  const queryResult = await fetch(BADGER_URL, {
    method: 'POST',
    body: JSON.stringify({ query }),
  });
  return queryResult.json();
};
