import { TOKENS } from '../config/tokens.config';
import * as requestUtils from '../etherscan/etherscan.utils';
import { getContractPrice, getTokenPrice } from './coingecko.utils';

describe('coingecko.utils', () => {
  describe('getContractPrice', () => {
    it('Fetches the contract price in USD', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const price = Math.random() * 100;
      const mockResponse = {
        '0x3472a5a71965499acd81997a54bba8d852c6e53d': {
          usd: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getContractPrice(contract);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: contract,
        price,
      });
    });

    it('Throws error on missing prices', async () => {
      const contract = '0x3472A5A71965499acd81997a54BBA8D852C6E53d';
      const price = Math.random() * 100;
      const mockResponse = {
        [contract]: {
          eth: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
      await expect(getContractPrice(contract)).rejects.toThrow(`Unable to resolve ${contract} price by contract`);
    });
  });

  describe('getTokenPrice', () => {
    it('Fetches the token price in USD and ETH', async () => {
      const token = 'Badger';
      const price = Math.random() * 100;
      const mockResponse = {
        Badger: {
          usd: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);

      const response = await getTokenPrice(token);
      expect(response).toBeDefined();
      expect(response).toMatchObject({
        address: TOKENS.BADGER,
        price,
      });
    });

    it('Throws error on missing prices', async () => {
      const token = 'Badger';
      const price = Math.random() * 100;
      const mockResponse = {
        Badger: {
          eth: price,
        },
      };
      jest.spyOn(requestUtils, 'request').mockImplementation(async () => mockResponse);
      await expect(getTokenPrice(token)).rejects.toThrow(`Unable to resolve ${token} price by name`);
    });
  });
});
