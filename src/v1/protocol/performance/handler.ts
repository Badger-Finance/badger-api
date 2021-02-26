import fetch from 'node-fetch';
import { setts } from '../../setts';
import {
	ASSET_DATA,
	CURRENT,
	CURVE_API_URL,
	ONE_DAY,
	ONE_YEAR_MS,
	SAMPLE_DAYS,
	SEVEN_DAYS,
	SUSHISWAP_URL,
	THIRTY_DAYS,
	THREE_DAYS,
	UNISWAP_URL,
} from '../../util/constants';
import {
	EventInput,
	getAssetData,
	getMasterChef,
	getSett,
	getSushiswapPrice,
	getTokenPrice,
	respond,
} from '../../util/util';
import { FarmData, getFarmData } from '../farm/handler';

export const handler = async (event: EventInput) => {
	try {
		const asset = event.pathParameters!.settName;
		const farmData = await getFarmData();
		return respond(200, await getAssetPerformance(asset, farmData));
	} catch (err) {
		console.log(err);
		return respond(500, {
			statusCode: 500,
			message: 'Unable to retrieve sett performance',
		});
	}
};

export const getAssetPerformance = async (asset: string, farmData: Record<string, FarmData>) => {
	console.log('Request performance data for', asset);

	const performanceInfo = await Promise.all([
		getProtocolPerformance(asset),
		getAssetData(ASSET_DATA, asset, SAMPLE_DAYS),
	]);

	const protocol = performanceInfo[0];
	const data = performanceInfo[1];

	if (!data) return; // FIXME: handle this better?

	const farmApy = farmData[asset] ? farmData[asset].apy : 0;

	const oneDay = getSamplePerformance(data, ONE_DAY, protocol.oneDay);
	const threeDay = getSamplePerformance(data, THREE_DAYS, protocol.oneDay);
	const sevenDay = getSamplePerformance(data, SEVEN_DAYS, protocol.sevenDay);
	const thirtyDay = getSamplePerformance(data, THIRTY_DAYS, protocol.thirtyDay);

	const settPerformance = {
		oneDay: oneDay,
		threeDay: threeDay,
		sevenDay: sevenDay,
		thirtyDay: thirtyDay,
		oneDayFarm: combineApy(oneDay, farmApy),
		threeDayFarm: combineApy(threeDay, farmApy),
		sevenDayFarm: combineApy(sevenDay, farmApy),
		thirtyDayFarm: combineApy(thirtyDay, farmApy),
	};

	return settPerformance;
};

// helper functions
const combineApy = (base: number | undefined, farm: number) => (base && isFinite(farm) ? base + farm : farm);
const getRatio = (data: { ratio: number }[], offset: number) =>
	data.length > offset ? data[data.length - (offset + 1)].ratio : undefined;
const getBlock = (data: { height: number }[], offset: number) =>
	data.length > offset ? data[data.length - (offset + 1)].height : undefined;
const getTimestamp = (data: { timestamp: number }[], offset: number) =>
	data.length > offset ? data[data.length - (offset + 1)].timestamp : undefined;

const getPerformance = (ratioDiff: number, blockDiff: number, timeDiff: number) => {
	const scalar = (ONE_YEAR_MS / timeDiff) * blockDiff;
	const slope = ratioDiff / blockDiff;
	return scalar * slope;
};

export type DataData = {
	ratio: number;
	height: number;
	timestamp: number;
	value?: number;
}[];

const getSamplePerformance = (data: DataData, offset: number, protocol: number): number | undefined => {
	// get current values
	const currentRatio = getRatio(data, CURRENT);
	const currentBlock = getBlock(data, CURRENT);
	const currentTimestamp = getTimestamp(data, CURRENT);

	// get sampled ratios
	const sampledRatio = getRatio(data, offset);
	const sampledBlock = getBlock(data, offset);
	const sampledTimestamp = getTimestamp(data, offset);

	if (!sampledRatio || !sampledBlock || !sampledTimestamp || !currentRatio || !currentBlock || !currentTimestamp) {
		return undefined;
	}

	const ratioDiff = currentRatio - sampledRatio;
	const blockDiff = currentBlock - sampledBlock;
	const timestampDiff = currentTimestamp - sampledTimestamp;
	return getPerformance(ratioDiff, blockDiff, timestampDiff) * 100 + protocol;
};

const getProtocolPerformance = async (asset: string) => {
	const defaultResponse = {
		oneDay: 0,
		threeDay: 0,
		sevenDay: 0,
		thirtyDay: 0,
	};

	const settKey = Object.keys(setts).find((sett) => setts[sett].asset.toLowerCase() === asset);
	if (!settKey) return defaultResponse;

	const switchKey = setts[settKey].protocol;
	switch (switchKey) {
		case 'curve':
			return await getCurvePerformance(asset);
		case 'uniswap':
			return await getSwapPerformance(setts[settKey].token, switchKey);
		case 'sushiswap':
			const earnings = await Promise.all([
				getSwapPerformance(setts[settKey].token, switchKey),
				getSushiswapEmissions(),
			]);
			const sushiswapApy = earnings[0];
			const sushiEmission = earnings[1][asset.toLowerCase()];
			const sushiEmissionApy = sushiEmission ? sushiEmission.apy * 100 : 0;
			sushiswapApy.oneDay += sushiEmissionApy;
			sushiswapApy.threeDay += sushiEmissionApy;
			sushiswapApy.sevenDay += sushiEmissionApy;
			sushiswapApy.thirtyDay += sushiEmissionApy;
			return sushiswapApy;
		default:
			return defaultResponse;
	}
};

const apyMapping = {
	hrenbtccrv: 'ren2',
	renbtccrv: 'ren2',
	sbtccrv: 'rens',
	tbtccrv: 'tbtc',
} as Record<string, string>;

const getCurvePerformance = async (asset: string) => {
	const curveData = await fetch(CURVE_API_URL).then((response) => response.json());
	return {
		oneDay: curveData.apy.day[apyMapping[asset]],
		threeDay: curveData.apy.day[apyMapping[asset]],
		sevenDay: curveData.apy.day[apyMapping[asset]],
		thirtyDay: curveData.apy.month[apyMapping[asset]],
	};
};

const getSwapPerformance = async (asset: string, protocol: string) => {
	const query = `
    {
      pairDayDatas(first: 30, orderBy: date, orderDirection: desc, where:{pairAddress: "${asset}"}) {
        reserveUSD
        dailyVolumeUSD
      }
    }
  `;
	const pairDayResponse = await fetch(protocol === 'uniswap' ? UNISWAP_URL : SUSHISWAP_URL, {
		method: 'POST',
		body: JSON.stringify({ query }),
	})
		.then((response) => response.json())
		.then((pairInfo) => pairInfo.data.pairDayDatas);

	const apyMap = {
		'0': 'oneDay',
		'2': 'threeDay',
		'6': 'sevenDay',
		'29': 'thirtyDay',
	} as Record<string, string>;

	const performance = {} as Record<string, number>;
	let totalApy = 0;
	for (let i = 0; i < pairDayResponse.length; i++) {
		const volume = parseFloat(pairDayResponse[i].dailyVolumeUSD);
		const poolReserve = parseFloat(pairDayResponse[i].reserveUSD);
		const fees = volume * 0.003;
		totalApy += (fees / poolReserve) * 365 * 100;
		if (apyMap[i.toString()]) {
			performance[apyMap[i.toString()]] = totalApy / (i + 1);
		}
	}
	Object.entries(apyMap).forEach((e) => {
		if (!performance[e[1]]) {
			performance[e[1]] = 0;
		}
	});
	return performance;
};

const getSushiswapEmissions = async () => {
	// parallelize calls
	const prerequisites = await Promise.all([getTokenPrice('sushi'), getMasterChef()]);

	const sushiPrice = prerequisites[0];
	const masterChefData = prerequisites[1];
	const masterChef = masterChefData.data.masterChefs[0];
	const masterChefPools = masterChefData.data.pools;

	const baseSushiPerBlock = masterChef.sushiPerBlock / 1e18;
	const farms = {} as Record<string, Record<string, number>>;

	await Promise.all(
		masterChefPools.map(async (pool) => {
			// evaluate farm key & token
			const settKey = Object.keys(setts).find((key) => setts[key].token === pool.pair);
			if (!settKey) {
				return;
			}
			const farmName = setts[settKey].asset.toLowerCase();
			const poolToken = setts[settKey].token;

			// calculate pool related information
			const allocShare = pool.allocPoint / masterChef.totalAllocPoint;
			const sushiPerBlock = allocShare * baseSushiPerBlock;
			const valuePerBlock = sushiPerBlock * sushiPrice;
			const tokenBalance = pool.balance / 1e18;

			const valueInfo = await Promise.all([getSett(settKey), getSushiswapPrice(poolToken)]);

			const ratio = valueInfo[0].data.sett.pricePerFullShare / 1e18;
			const valueBalance = valueInfo[1] * ratio * tokenBalance;
			const apy = (toDay(valuePerBlock) / valueBalance) * 365;
			farms[farmName] = {
				tokenBalance: tokenBalance,
				valueBalance: formatApy(valueBalance),
				allocShare: allocShare,
				sushiPerBlock: formatApy(sushiPerBlock),
				valuePerBlock: formatApy(valuePerBlock),
				sushiPerHour: formatApy(toHour(sushiPerBlock)),
				valuePerHour: formatApy(toHour(valuePerBlock)),
				sushiPerDay: formatApy(toDay(sushiPerBlock)),
				valuePerDay: formatApy(toDay(valuePerBlock)),
				apy: formatApy(apy),
			};
		}),
	);

	return farms;
};

// scaling functions
const toHour = (value: number) => value * 276;
const toDay = (value: number) => toHour(value) * 24;
const formatApy = (value: number) => parseFloat(value.toFixed(4));
