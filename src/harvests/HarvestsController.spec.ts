import { PlatformTest } from '@tsed/common';
import SuperTest from 'supertest';
import { Server } from '../Server';
import { HarvestsService } from './HarvestsService';

describe('HarvestsController', () => {
	let request: SuperTest.SuperTest<SuperTest.Test>;
	let harvestsService: HarvestsService;

	beforeAll(PlatformTest.bootstrap(Server));
	beforeAll(async () => {
		request = SuperTest(PlatformTest.callback());
		harvestsService = PlatformTest.get<HarvestsService>(HarvestsService);
	});

	afterEach(PlatformTest.reset);

	describe('GET /v2/harvests', () => {
		it('returns a list of harvests', async () => {
			jest.spyOn(harvestsService, 'listHarvests').mockImplementationOnce(() => Promise.resolve({ harvests: [] }));

			const response = await request.get('/v2/harvests').expect(200);
			expect(response).toMatchObject({
				body: expect.any(Array),
			});
		});
	});
});
