import { BigNumber, ethers } from 'ethers';
import { setts } from '../../setts';
import { diggAbi, geyserAbi } from '../../util/abi';
import { ETHERS_JSONRPC_PROVIDER, TOKENS } from '../../util/constants';
import { getGeysers, getPrices, getUsdValue, Geyser, respond } from '../../util/util';
import { getAssetPerformance } from '../performance/handler';

export const handler = async () => {
  try {
    const farmData = await getFarmData();
    const settData = await Promise.all(
      Object.entries(setts).map((sett) => getAssetPerformance(sett[1].asset.toLowerCase(), farmData)),
    );
    Object.entries(setts).forEach((sett, i) => {
      const farm = farmData[sett[1].asset.toLowerCase()];
      if (farm) {
        const combinedApy = settData[i]!.threeDayFarm; // FIXME: assumes settData[i] is not undefined
        farm.apy = combinedApy ? combinedApy : farm.apy;
      }
    });
    return respond(200, farmData);
  } catch (err) {
    console.log(err);
    return respond(500, {
      statusCode: 500,
      message: 'Unable to retreive sett performance',
    });
  }
};

export type FarmData = {
  tokenBalance: number;
  valueBalance: number;
  badgerPerDay: number;
  diggPerDay: number;
  badgerValuePerDay: number;
  diggValuePerDay: number;
  valuePerDay: number;
  apy: number;
  badgerApy: number;
  diggApy: number;
};

export const getFarmData = async () => {
  // parallelize calls
  const prerequisites = await Promise.all([getPrices(), getGeysers(), getSharesPerFragment()]);

  const priceData = prerequisites[0];
  const geyserData = prerequisites[1];
  const sharesPerFragment = prerequisites[2];
  const geysers = geyserData.data.geysers;
  const geyserSetts = geyserData.data.setts;
  const farms = {} as Record<string, FarmData>;

  const now = new Date();
  await Promise.all(
    geysers.map(async (geyser: Geyser) => {
      // evaluate farm key & token
      const sett = geyserSetts.find((geyserSett) => geyserSett.id === geyser.stakingToken.id);
      if (!sett) return;

      const geyserName = setts[sett.id].asset.toLowerCase();
      const geyserToken = sett.token.id;
      const geyserDeposits = sett.balance / 1e18;
      const geyserDepositsValue = getUsdValue(geyserToken, geyserDeposits, priceData);

      // calculate pool related information
      const getRate = (value: number, duration: number) => (duration > 0 ? value / duration : 0);

      // badger emissions
      const badgerSchedules = await getEmissions(geyser.id, TOKENS.BADGER);
      const badgerUnlockSchedules = badgerSchedules.filter(
        (d, i) => new Date(d.endAtSec && d.endAtSec.toNumber() * 1000) > now || i === badgerSchedules.length - 1,
      );
      let badgerEmission = 0;
      let badgerEmissionStart = 0;
      let badgerEmisisonEnd = 0;
      badgerUnlockSchedules.forEach((s) => {
        badgerEmission += s.initialLocked / 1e18;
        const start = s.startTime.toNumber();
        const end = s.endAtSec.toNumber();
        if (badgerEmissionStart == 0 || start < badgerEmissionStart) {
          badgerEmissionStart = start;
        }
        if (badgerEmisisonEnd == 0 || end > badgerEmisisonEnd) {
          badgerEmisisonEnd = end;
        }
      });
      const badgerEmissionDuration = badgerEmisisonEnd - badgerEmissionStart;
      const badgerEmissionValue = badgerEmission * priceData.badger;
      const badgerEmissionRate = getRate(badgerEmission, badgerEmissionDuration);
      const badgerEmissionValueRate = getRate(badgerEmissionValue, badgerEmissionDuration);
      const badgerApy = ((toDay(badgerEmissionValueRate) * 365) / geyserDepositsValue) * 100;

      // digg emissions
      const diggSchedules = await getEmissions(geyser.id, TOKENS.DIGG);
      const diggUnlockSchedules = diggSchedules.filter(
        (d, i) => new Date(d.endAtSec && d.endAtSec.toNumber() * 1000) > now || i === diggSchedules.length - 1,
      );
      let diggEmission = 0;
      let diggEmissionStart = 0;
      let diggEmisisonEnd = 0;
      diggUnlockSchedules.forEach((s) => {
        diggEmission += s.initialLocked / 1e9;
        const start = s.startTime.toNumber();
        const end = s.endAtSec.toNumber();
        if (diggEmissionStart == 0 || start < diggEmissionStart) {
          diggEmissionStart = start;
        }
        if (diggEmisisonEnd == 0 || end > diggEmisisonEnd) {
          diggEmisisonEnd = end;
        }
      });
      const diggEmissionDuration = diggEmisisonEnd - diggEmissionStart;
      diggEmission /= sharesPerFragment;
      const diggEmissionValue = diggEmission * priceData.digg;
      const diggEmissionRate = getRate(diggEmission, diggEmissionDuration);
      const diggEmissionValueRate = getRate(diggEmissionValue, diggEmissionDuration);
      const diggApy = ((toDay(diggEmissionValueRate) * 365) / geyserDepositsValue) * 100;

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
    }),
  );

  // Setts that do not get badger emissions - these will only measure ppfs growth
  await Promise.all(
    Object.entries(setts).map(async (noFarmSett) => {
      const sett = geyserSetts.find((s) => s.id === noFarmSett[0]);
      const asset = noFarmSett[1].asset.toLowerCase();
      const farm = farms[asset];

      if (!farm) {
        let settDeposits = 0;
        let settDepositsValue = 0;

        if (sett) {
          const token = sett.token.id;
          settDeposits = parseInt(sett.balance.toString());
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
    }),
  );

  return farms;
};

export type UnlockSchedules = {
  initialLocked: number;
  endAtSec: BigNumber;
  durationSec: number;
  startTime: BigNumber;
}[];

const getEmissions = async (geyser: string, token: string): Promise<UnlockSchedules> => {
  const geyserContract = new ethers.Contract(geyser, geyserAbi, ETHERS_JSONRPC_PROVIDER);
  return await geyserContract.getUnlockSchedulesFor(token);
};

const getSharesPerFragment = async () => {
  const diggContract = new ethers.Contract(TOKENS.DIGG, diggAbi, ETHERS_JSONRPC_PROVIDER);
  return await diggContract._sharesPerFragment();
};

// scaling functions
const toHour = (value: number) => value * 3600;
const toDay = (value: number) => toHour(value) * 24;
