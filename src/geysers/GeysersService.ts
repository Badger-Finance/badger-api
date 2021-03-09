import { Inject, Service } from '@tsed/common';
import { constants, ethers } from 'ethers';
import { Emission, Geyser, UnlockSchedule } from '../interface/Geyser';
import { Sett } from '../interface/Sett';
import { ValueSource } from '../interface/ValueSource';
import { PriceService } from '../prices/PricesService';
import { setts } from '../service/setts';
import { SettService } from '../setts/SettsService';
import { TokenService } from '../tokens/TokenService';
import { diggAbi, geyserAbi } from '../util/abi';
import { eth } from '../util/chain';
import { TOKENS } from '../util/constants';
import { getGeysers, secondToDay, toRate } from '../util/util';

@Service()
export class GeyserService {
	@Inject()
	settService!: SettService;
	@Inject()
	tokenService!: TokenService;
	@Inject()
	priceService!: PriceService;

	async listFarms(): Promise<Sett[]> {
		const diggContract = new ethers.Contract(TOKENS.DIGG, diggAbi, eth.provider);

		const [settData, geyserData, sharesPerFragment] = await Promise.all([
			this.settService.listSetts(),
			getGeysers(),
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
				const pricePerFullShare = sett.pricePerFullShare / 1e18;
				const geyserDeposits = (geyser.netShareDeposit * pricePerFullShare) / 1e18;
				const geyserDepositsValue = await this.priceService.getUsdValue(geyserToken, geyserDeposits);
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
					const badgerEmissionValue = await this.priceService.getUsdValue(TOKENS.BADGER, badgerEmitted);
					const badgerEmissionValueRate = toRate(badgerEmissionValue, badgerEmissionDuration);
					const badgerApy = ((secondToDay(badgerEmissionValueRate) * 365) / geyserDepositsValue) * 100;

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
					const diggEmissionValue = await this.priceService.getUsdValue(TOKENS.DIGG, diggEmitted);
					const diggEmissionValueRate = toRate(diggEmissionValue, diggEmissionDuration);
					const diggApy = ((secondToDay(diggEmissionValueRate) * 365) / geyserDepositsValue) * 100;

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
		const geyserContract = new ethers.Contract(geyserAddress, geyserAbi, eth.provider);
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
