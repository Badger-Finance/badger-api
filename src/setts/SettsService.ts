import { Service } from '@tsed/common';
import { BadRequest, NotFound } from '@tsed/exceptions';
import { Chain } from '../config/chain/chain';
import {
	ASSET_DATA,
	CURRENT,
	ONE_DAY,
	ONE_YEAR_MS,
	SAMPLE_DAYS,
	SEVEN_DAYS,
	THIRTY_DAYS,
	THREE_DAYS,
} from '../config/constants';
import { getAssetData } from '../config/util';
import { Performance } from '../interface/Performance';
import { ProtocolSummary } from '../interface/ProtocolSummary';
import { Sett, SettSummary } from '../interface/Sett';
import { SettSnapshot } from '../interface/SettSnapshot';
import { ValueSource } from '../interface/ValueSource';
import { ProtocolService } from '../protocols/ProtocolsService';
import { TokensService } from '../tokens/TokensService';

@Service()
export class SettService {
	constructor(private protocolService: ProtocolService, private tokenSerivce: TokensService) {}

	async getProtocolSummary(chain: Chain): Promise<ProtocolSummary> {
		const setts = await this.listSetts(chain);
		const settSummaries = setts.map(
			(s) =>
				({
					name: s.name,
					asset: s.asset,
					value: s.value,
					tokens: s.tokens,
				} as SettSummary),
		);
		const totalValue = settSummaries.map((s) => s.value).reduce((total, value) => (total += value), 0);
		return {
			totalValue: totalValue,
			setts: settSummaries,
		} as ProtocolSummary;
	}

	async listSetts(chain: Chain): Promise<Sett[]> {
		const settNames = Object.values(chain.setts).map((s) => s.symbol.toLocaleLowerCase());
		return await Promise.all(settNames.map((s) => this.getSett(chain, s)));
	}

	async getSett(chain: Chain, settName: string): Promise<Sett> {
		if (!settName) {
			throw new BadRequest('settName is required');
		}
		const settData = chain.setts.find((s) => s.symbol.toLowerCase() === settName.toLowerCase());

		if (!settData) {
			throw new NotFound(`${settName} is not a valid sett`);
		}

		const sett: Sett = {
			name: settData.name,
			asset: settData.symbol,
			vaultToken: settData.settToken,
			underlyingToken: settData.depositToken,
			ppfs: 0,
			value: 0,
			apy: 0,
			tokens: [],
			sources: [],
		};

		const [protocolValueSource, settSnapshots] = await Promise.all([
			this.protocolService.getProtocolPerformance(settData),
			this.getSettSnapshots(settName, SAMPLE_DAYS),
		]);
		const settState = settSnapshots[CURRENT];
		const settValueSource = this.getSettUnderlyingValueSource(settName, settSnapshots);

		sett.ppfs = settState.ratio;
		sett.value = settState.value;
		sett.tokens = await this.tokenSerivce.getSettTokens(chain, settData.settToken, settState);
		sett.apy = settValueSource.apy;
		sett.sources = [settValueSource];

		if (protocolValueSource) {
			sett.apy += protocolValueSource.apy;
			sett.sources.push(protocolValueSource);
		}

		return sett;
	}

	async getSettSnapshots(settName: string, count?: number): Promise<SettSnapshot[]> {
		const snapshots = await getAssetData(ASSET_DATA, settName.toLowerCase(), count);
		if (!snapshots) {
			throw new NotFound(`${settName} is not a valid sett`);
		}
		return snapshots;
	}

	getSettUnderlyingValueSource(settName: string, settSnapshots: SettSnapshot[]): ValueSource {
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

	getSettSampledPerformance(settSnapshots: SettSnapshot[], sampleIndex: number): number {
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
