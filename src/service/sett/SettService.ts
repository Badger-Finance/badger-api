import { ProtocolSummary } from '../../interface/ProtocolSummary';
import {
	ASSET_DATA,
	SAMPLE_DAYS,
	CURRENT,
	ONE_YEAR_MS,
	ONE_DAY,
	THREE_DAYS,
	SEVEN_DAYS,
	THIRTY_DAYS,
} from '../../util/constants';
import { ProtocolService } from '../protocol/ProtocolService';
import { SettSnapshot } from '../../interface/SettSnapshot';
import { ValueSource } from '../../interface/ValueSource';
import { Performance } from '../../interface/Performance';
import { NotFound, BadRequest } from '@tsed/exceptions';
import { TokenService } from '../token/TokenService';
import { SettSummary } from '../../interface/Sett';
import { getAssetData, getPrices } from '../../util/util';
import { Sett } from '../../interface/Sett';
import { Service } from '@tsed/common';
import { setts } from '../setts';

@Service()
export class SettService {
	constructor(private protocolService: ProtocolService, private tokenSerivce: TokenService) {}

	async getProtocolSummary(): Promise<ProtocolSummary> {
		const setts = await this.listSetts();
		const settSummaries = setts.map(
			(s) =>
				({
					name: s.name,
					asset: s.asset,
					value: s.value,
					tokens: s.tokens,
				} as SettSummary),
		);
		const totalValue = settSummaries.map((s) => s.value).reduce((total, value) => (total += value));
		return {
			totalValue: totalValue,
			setts: settSummaries,
		} as ProtocolSummary;
	}

	async listSetts(): Promise<Sett[]> {
		const settNames = Object.values(setts).map((s) => s.symbol.toLocaleLowerCase());
		return await Promise.all(settNames.map((s) => this.getSett(s)));
	}

	async getSett(settName: string): Promise<Sett> {
		if (!settName) {
			throw new BadRequest('settName is required');
		}
		const settData = setts.find((s) => s.symbol.toLowerCase() === settName.toLowerCase());

		if (!settData) {
			throw new NotFound(`${settName} is not a valid sett`);
		}

		const sett: Sett = {
			name: settData.name,
			asset: settData.symbol,
			ppfs: 0,
			value: 0,
			apy: 0,
			tokens: [],
			sources: [],
		};

		// TODO: TheGraphService, PriceService
		const [protocolValueSource, settSnapshots, prices] = await Promise.all([
			this.protocolService.getProtocolPerformance(settData),
			this.getSettSnapshots(settName, SAMPLE_DAYS),
			getPrices(),
		]);
		const settState = settSnapshots[CURRENT];
		const settValueSource = this.getSettUnderlyingValueSource(settName, settSnapshots);

		sett.ppfs = settState.ratio;
		sett.value = settState.value;
		sett.apy = protocolValueSource.apy + settValueSource.apy;
		sett.tokens = await this.tokenSerivce.getSettTokens(settData.settToken, settState.balance, prices);
		sett.sources = [settValueSource, protocolValueSource];

		return sett;
	}

	async getSettSnapshots(settName: string, count?: number): Promise<SettSnapshot[]> {
		const snapshots = await getAssetData(ASSET_DATA, settName.toLowerCase(), count);
		if (!snapshots) {
			throw new NotFound(`${settName} is not a valid sett`);
		}
		return snapshots;
	}

	private getSettUnderlyingValueSource(settName: string, settSnapshots: SettSnapshot[]): ValueSource {
		const settPerformance: Performance = {
			oneDay: this.getSettSampledPerformance(settSnapshots, ONE_DAY),
			threeDay: this.getSettSampledPerformance(settSnapshots, THREE_DAYS),
			sevenDay: this.getSettSampledPerformance(settSnapshots, SEVEN_DAYS),
			thirtyDay: this.getSettSampledPerformance(settSnapshots, THIRTY_DAYS),
		};
		return {
			name: settName,
			apy: settPerformance.threeDay,
			performance: settPerformance,
		} as ValueSource;
	}

	private getSettSampledPerformance(settSnapshots: SettSnapshot[], sampleIndex: number): number {
		const currentSnapshot = settSnapshots[CURRENT];
		if (sampleIndex > settSnapshots.length - 1) {
			return 0;
		}
		const sampledSnapshot = settSnapshots[sampleIndex];
		const ratioDiff = currentSnapshot.ratio - sampledSnapshot.ratio;
		const blockDiff = currentSnapshot.height - sampledSnapshot.height;
		const timestampDiff = currentSnapshot.timestamp - sampledSnapshot.timestamp;
		const slope = ratioDiff / blockDiff;
		const scalar = (ONE_YEAR_MS / timestampDiff) * blockDiff;
		return slope * scalar * 100;
	}
}
