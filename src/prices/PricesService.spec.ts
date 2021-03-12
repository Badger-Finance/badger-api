import fetchMock from 'jest-fetch-mock';
import { getContractPrice, getTokenPrice } from './PricesService';

describe('PricesService', () => {
	beforeEach(fetchMock.resetMocks);

	it('Fetches the contract price in USD and ETH', async () => {
		const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
		const usdPrice = Math.random() * 100;
		const etherPrice = usdPrice / 1500;
		const mockResponse = {
			'0x3472a5a71965499acd81997a54bba8d852c6e53d': {
				usd: usdPrice,
				eth: etherPrice,
			},
		};
		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const response = await getContractPrice(contract);

		expect(fetchMock).toHaveBeenCalled();
		expect(response).toBeDefined();
		expect(response).toMatchObject({
			address: contract,
			usd: usdPrice,
			eth: etherPrice,
		});
	});

	it('Fetches the token price in USD and ETH', async () => {
		const token = 'Badger';
		const usdPrice = Math.random() * 100;
		const etherPrice = usdPrice / 1500;
		const mockResponse = {
			Badger: {
				usd: usdPrice,
				eth: etherPrice,
			},
		};
		fetchMock.mockResponseOnce(JSON.stringify(mockResponse));

		const response = await getTokenPrice(token);

		expect(fetchMock).toHaveBeenCalled();
		expect(response).toBeDefined();
		expect(response).toMatchObject({
			name: token,
			usd: usdPrice,
			eth: etherPrice,
		});
	});
});
