import { PlatformTest } from '@tsed/common';
import { GraphQLClient } from 'graphql-request';
import { HarvestFragment, HarvestsQuery } from '../graphql/generated/badger-dao';
import { HarvestsService } from './HarvestsService';

describe('HarvestsService', () => {
	let service: HarvestsService;

	beforeAll(async () => {
		await PlatformTest.create();

		service = PlatformTest.get<HarvestsService>(HarvestsService);
	});

	afterEach(PlatformTest.reset);

	describe('listHarvests', () => {
		it('returns a list of Harvest objects', async () => {
			const mockHarvests: HarvestFragment[] = [
				{
					id: 'harvest_123',
					earnings: 0,
					pricePerFullShareBefore: 0,
					pricePerFullShareAfter: 0,
					pricePerFullShareBeforeRaw: 0,
					pricePerFullShareAfterRaw: 0,
					vaultBalanceBeforeRaw: 0,
					vaultBalanceAfterRaw: 0,
					strategyBalanceBeforeRaw: 0,
					strategyBalanceAfterRaw: 0,
					earningsRaw: 0,
					transaction: {
						id: 'transaction_123',
						timestamp: 0,
						blockNumber: 0,
						transactionHash: 0,
					},
					vault: {
						id: 'vault_123',
						pricePerFullShare: 0,
						totalSupply: 0,
						vaultBalance: 0,
						strategyBalance: 0,
						available: 0,
					},
				},
			];
			const mockResponse: HarvestsQuery = {
				harvests: mockHarvests,
			};

			jest.spyOn(GraphQLClient.prototype, 'request').mockImplementationOnce(async () =>
				Promise.resolve(mockResponse),
			);

			const { harvests } = await service.listHarvests({});
			for (const record of harvests) {
				expect(record).toMatchObject({
					id: expect.any(String),
					earnings: expect.any(Number),
					pricePerFullShareBefore: expect.any(Number),
					pricePerFullShareAfter: expect.any(Number),
					pricePerFullShareBeforeRaw: expect.any(Number),
					pricePerFullShareAfterRaw: expect.any(Number),
					vaultBalanceBeforeRaw: expect.any(Number),
					vaultBalanceAfterRaw: expect.any(Number),
					strategyBalanceBeforeRaw: expect.any(Number),
					strategyBalanceAfterRaw: expect.any(Number),
					earningsRaw: expect.any(Number),
				});
			}
		});
	});
});
