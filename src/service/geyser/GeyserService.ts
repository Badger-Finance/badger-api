import { Geyser, UnlockSchedule, Emission } from '../../interface/Geyser';
import { TOKENS, ETHERS_JSONRPC_PROVIDER } from '../../util/constants';
import { getGeysers, getPrices, getUsdValue } from '../../util/util';
import { ValueSource } from '../../interface/ValueSource';
import { TokenService } from '../token/TokenService';
import { diggAbi, geyserAbi } from '../../util/abi';
import { SettService } from '../sett/SettService';
import { Sett } from '../../interface/Sett';
import { ethers, constants } from 'ethers';
import { Service } from '@tsed/common';
import { setts } from '../setts';

// Helper Functions - TODO: utils? service functions?
const toHour = (value: number) => value * 3600;
const toDay = (value: number) => toHour(value) * 24;
const getRate = (value: number, duration: number) => (duration > 0 ? value / duration : 0);

@Service()
export class GeyserService {
	constructor(private settService: SettService, private tokenService: TokenService) {}

	async listFarms(): Promise<Sett[]> {
		const diggContract = new ethers.Contract(TOKENS.DIGG, diggAbi, ETHERS_JSONRPC_PROVIDER);

		const [settData, geyserData, prices, sharesPerFragment] = await Promise.all([
			this.settService.listSetts(),
			getGeysers(),
			getPrices(),
			diggContract._sharesPerFragment(),
		]);
		const geysers = geyserData.data.geysers;
		const geyserSetts = geyserData.data.setts;

		await Promise.all(
			geysers.map(async (geyser) => {
				const sett = geyserSetts.find((geyserSett) => geyserSett.id === geyser.stakingToken.id);
				const settLink = setts.find((s) => s.geyserAddress && s.geyserAddress === geyser.id);
				const settInfo = settData.find((s) => s.asset.toLowerCase() === settLink?.symbol.toLowerCase());
				if (!sett || !settLink || !settInfo) return;

				// Collect Geyser Information
				const geyserToken = sett.token.id;
				const geyserDeposits = sett.balance / 1e18;
				const geyserDepositsValue = getUsdValue(geyserToken, geyserDeposits, prices);
				const geyserData = await this.getGeyserData(geyser.id, sharesPerFragment);
				const [badgerEmissionData, diggEmissionData] = geyserData.emissions;
				const emissionSources = [] as ValueSource[];

				// Calculate Emission Values
				if (badgerEmissionData) {
					const badgerUnlockSchedule = badgerEmissionData.unlockSchedule;
					const badgerEmitted = badgerUnlockSchedule.initialLocked.toNumber();
					const badgerEmissionDuration = badgerUnlockSchedule.endAtSec
						.sub(badgerUnlockSchedule.startTime)
						.toNumber();
					const badgerEmissionValue = badgerEmitted * prices.badger;
					const badgerEmissionValueRate = getRate(badgerEmissionValue, badgerEmissionDuration);
					const badgerApy = ((toDay(badgerEmissionValueRate) * 365) / geyserDepositsValue) * 100;

					// Emission value is constant, so performance values a identical for every sample
					const badgerSource: ValueSource = {
						name: 'badger',
						apy: badgerApy,
						performance: {
							oneDay: badgerApy,
							threeDay: badgerApy,
							sevenDay: badgerApy,
							thirtyDay: badgerApy,
						},
					};
					emissionSources.push(badgerSource);
				}

				if (diggEmissionData) {
					const diggUnlockSchedule = diggEmissionData.unlockSchedule;
					const diggEmitted = diggUnlockSchedule.initialLocked.toNumber();
					const diggEmissionDuration = diggUnlockSchedule.endAtSec
						.sub(diggUnlockSchedule.startTime)
						.toNumber();
					const diggEmissionValue = diggEmitted * prices.digg;
					const diggEmissionValueRate = getRate(diggEmissionValue, diggEmissionDuration);
					const diggApy = ((toDay(diggEmissionValueRate) * 365) / geyserDepositsValue) * 100;

					const diggSource: ValueSource = {
						name: 'digg',
						apy: diggApy,
						performance: {
							oneDay: diggApy,
							threeDay: diggApy,
							sevenDay: diggApy,
							thirtyDay: diggApy,
						},
					};
					emissionSources.push(diggSource);
				}

				settInfo.value = geyserDepositsValue;
				settInfo.sources = settInfo.sources.concat(emissionSources);
				settInfo.apy = settInfo.sources.map((s) => s.apy).reduce((total, apy) => (total += apy));
			}),
		);

		return settData;
	}

	async getGeyserData(geyserAddress: string, sharesPerFragment: number): Promise<Geyser> {
		const geyserContract = new ethers.Contract(geyserAddress, geyserAbi, ETHERS_JSONRPC_PROVIDER);
		const [badgerUnlockSchedules, diggUnlockSchedules] = await Promise.all([
			geyserContract.getUnlockSchedulesFor(TOKENS.BADGER) as UnlockSchedule[],
			geyserContract.getUnlockSchedulesFor(TOKENS.DIGG) as UnlockSchedule[],
		]);

		// UnlockSchedule objects are recreated due to returned objects underlying as arrays.
		const emissions = [];
		if (badgerUnlockSchedules.length > 0) {
			const badgerUnlock = badgerUnlockSchedules[badgerUnlockSchedules.length - 1];
			const badgerEmission: Emission = {
				token: this.tokenService.getTokenByName('Badger'),
				unlockSchedule: {
					startTime: badgerUnlock.startTime,
					endAtSec: badgerUnlock.endAtSec,
					durationSec: badgerUnlock.durationSec,
					initialLocked: badgerUnlock.initialLocked.div(constants.WeiPerEther),
				},
			};
			emissions.push(badgerEmission);
		} else {
			emissions.push(undefined);
		}
		if (diggUnlockSchedules.length > 0) {
			const diggUnlock = diggUnlockSchedules[diggUnlockSchedules.length - 1];
			const diggEmission: Emission = {
				token: this.tokenService.getTokenByName('Digg'),
				unlockSchedule: {
					startTime: diggUnlock.startTime,
					endAtSec: diggUnlock.endAtSec,
					durationSec: diggUnlock.durationSec,
					initialLocked: diggUnlock.initialLocked.div(1e9).div(sharesPerFragment),
				},
			};
			emissions.push(diggEmission);
		} else {
			emissions.push(undefined);
		}
		return {
			emissions: emissions,
		} as Geyser;
	}
}
